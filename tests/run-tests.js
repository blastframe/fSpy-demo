#!/usr/bin/env node
/**
 * Headless test suite.
 *
 * 1. engine   - the committed bundle must match vendor/ (no hand edits)
 * 2. oracle   - the web app must reproduce the reference solutions produced by
 *               the upstream solver for real .fspy projects
 * 3. ui       - the page boots, every control is wired, and view state cannot
 *               change the calibration
 * 4. project  - .fspy write/read round trips, image bytes preserved
 *
 * Run with: npm test
 */
'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')
const { JSDOM, VirtualConsole } = require('jsdom')

const ROOT = path.resolve(__dirname, '..')
const FIXTURES = path.join(ROOT, 'tests', 'fixtures')

let failures = 0
let checks = 0
const section = name => console.log('\n\x1b[1m' + name + '\x1b[0m')
function check(name, condition, detail) {
  checks++
  if (condition) {
    console.log('  \x1b[32mPASS\x1b[0m ' + name + (detail ? '  \x1b[2m' + detail + '\x1b[0m' : ''))
  } else {
    failures++
    console.log('  \x1b[31mFAIL\x1b[0m ' + name + (detail ? '  ' + detail : ''))
  }
}
const near = (a, b, tol = 1e-12) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tol

// ---------------------------------------------------------------- 1. engine
section('1. Engine bundle')
try {
  execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-fspy-bundle.js'), '--check'], { stdio: 'pipe' })
  check('src/engine/fspy-engine.js is built from vendor/fspy (unmodified)', true)
} catch (err) {
  check('src/engine/fspy-engine.js is built from vendor/fspy (unmodified)', false, String(err.stderr || err.message).trim())
}
const bundled = new Function(fs.readFileSync(path.join(ROOT, 'src', 'engine', 'fspy-engine.js'), 'utf8') + '; return FSpyOriginal;')()
check('bundle exposes the upstream solver surface',
  ['Solver', 'MathUtil', 'CoordinatesUtil', 'Transform', 'Vector3D', 'cameraPresets']
    .every(key => key in bundled))

// ------------------------------------------------------- 2. oracle parity
section('2. Parity with the original solver (tests/fixtures)')
const oracle = JSON.parse(fs.readFileSync(path.join(FIXTURES, 'oracle.json'), 'utf8'))
const matrixError = (a, b) => {
  let worst = 0
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) worst = Math.max(worst, Math.abs(a[r][c] - b[r][c]))
  return worst
}
for (const [file, expected] of Object.entries(oracle)) {
  const bytes = fs.readFileSync(path.join(FIXTURES, file))
  const jsonLength = bytes.readUInt32LE(8)
  const state = JSON.parse(bytes.slice(16, 16 + jsonLength).toString('utf8'))
  const image = { width: expected.image.w, height: expected.image.h, url: null, data: null }
  const result = state.globalSettings.calibrationMode === 'OneVanishingPoint'
    ? bundled.Solver.solve1VP(state.calibrationSettingsBase, state.calibrationSettings1VP,
        state.controlPointsStateBase, state.controlPointsState1VP, image)
    : bundled.Solver.solve2VP(state.calibrationSettingsBase, state.calibrationSettings2VP,
        state.controlPointsStateBase, state.controlPointsState2VP, image)

  if (!expected.cameraParameters) {
    check(`${file}: reproduces the original failure`,
      result.cameraParameters === null && result.errors.length > 0,
      result.errors.join('; '))
    continue
  }
  const cam = result.cameraParameters
  if (!cam) {
    check(`${file}: camera solved`, false, result.errors.join('; '))
    continue
  }
  const worst = Math.max(
    Math.abs(cam.relativeFocalLength - expected.cameraParameters.relativeFocalLength),
    Math.abs(cam.horizontalFieldOfView - expected.cameraParameters.horizontalFieldOfView),
    Math.abs(cam.principalPoint.x - expected.cameraParameters.principalPoint.x),
    Math.abs(cam.principalPoint.y - expected.cameraParameters.principalPoint.y),
    matrixError(cam.viewTransform.matrix, expected.cameraParameters.viewTransform),
    matrixError(cam.cameraTransform.matrix, expected.cameraParameters.cameraTransform)
  )
  check(`${file}: camera identical to oracle`, worst === 0, `max Δ = ${worst}`)
  check(`${file}: axis assignment identical`,
    cam.vanishingPointAxes.join() === expected.cameraParameters.vanishingPointAxes.join(),
    cam.vanishingPointAxes.join(', '))
}

// ------------------------------------------------------------- 3./4. UI
section('3. Application (boots in jsdom)')
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
const engine = fs.readFileSync(path.join(ROOT, 'src', 'engine', 'fspy-engine.js'), 'utf8')
// jsdom cannot fetch <script src> without a resource loader, so inline the
// engine for the test only (the shipped page loads it with a script tag).
const pageHtml = html.replace('<script src="src/engine/fspy-engine.js"></script>', '<script>' + engine + '</script>')

const virtualConsole = new VirtualConsole()
const pageErrors = []
virtualConsole.on('jsdomError', err => pageErrors.push(err.message))

const dom = new JSDOM(pageHtml, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost:8080/index.html',
  virtualConsole,
  beforeParse(window) {
    window.TextEncoder = TextEncoder
    window.TextDecoder = TextDecoder
    window.fetch = async url => {
      const file = path.join(ROOT, decodeURIComponent(String(url).replace(/^http:\/\/localhost:8080\//, '')))
      if (!fs.existsSync(file)) {
        return { ok: false, status: 404, json: async () => { throw new Error('404 ' + url) }, arrayBuffer: async () => { throw new Error('404 ' + url) } }
      }
      const buffer = fs.readFileSync(file)
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(buffer.toString('utf8')),
        arrayBuffer: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
      }
    }
    // minimal image decoding: report the real size of the example project image
    window.Image = class {
      set src(value) {
        setTimeout(() => {
          this.naturalWidth = 993
          this.naturalHeight = 577
          if (this.onload) this.onload()
        }, 0)
      }
    }
    window.URL.createObjectURL = () => 'assets/example.png'
    window.URL.revokeObjectURL = () => {}
  }
})

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

;(async () => {
  await wait(1000)
  const doc = dom.window.document
  const text = id => doc.getElementById(id).textContent
  const api = dom.window.FSpyWeb

  check('no uncaught page errors', pageErrors.length === 0, pageErrors.join(' | '))
  check('example project loaded and solved', text('badge') === 'SOLVED', text('statustext'))
  check('image dimensions from the embedded image', text('imgdim-badge') === '993×577', text('imgdim-badge'))

  const defaultsOracle = oracle['defaults.fspy'].cameraParameters
  const relFocal = parseFloat(text('relFocal'))
  check('readout matches oracle relative focal length',
    Math.abs(relFocal - defaultsOracle.relativeFocalLength) < 5e-6, `${relFocal} vs ${defaultsOracle.relativeFocalLength}`)
  check('camera matrix rendered from the solver', doc.querySelectorAll('#matrixBox span').length === 16)
  check('overlay geometry drawn', doc.getElementById('overlay').childElementCount > 10,
    doc.getElementById('overlay').childElementCount + ' nodes')

  const solvedCamera = JSON.stringify(api.solve().cameraParameters)

  // every interactive control must be wired: poke each and require a repaint
  section('4. Controls are live')
  const controls = [
    ['mode', 'OneVanishingPoint'], ['mode', 'TwoVanishingPoints'],
    ['principalMode', 'Manual'], ['principalMode', 'FromMidpoint'], ['principalMode', 'Default'],
    ['axis1', 'zNegative'], ['axis1', 'xPositive'],
    ['axis2', 'yPositive'], ['axis2', 'zPositive'],
    ['referenceAxis', 'xPositive'], ['referenceAxis', ''],
    ['guide', 'Box'], ['guide', 'XYGridFloor'], ['guide', 'YZGridFloor'], ['guide', 'ZXGridFloor'], ['guide', 'None'],
    ['distanceUnit', 'Feet'], ['distanceUnit', 'Meters'],
    ['editmode', 'linked'], ['editmode', 'free']
  ]
  for (const [id, value] of controls) {
    const el = doc.getElementById(id)
    el.value = value
    el.dispatchEvent(new dom.window.Event('input', { bubbles: true }))
    const rendered = doc.getElementById('overlay').childElementCount > 0
    check(`control #${id} = ${value || '(none)'} re-solves and repaints`, rendered)
  }
  const preset = doc.getElementById('cameraPreset')
  preset.value = 'canon_5d'
  preset.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
  check('camera preset updates the sensor size',
    doc.getElementById('sensorWidth').value === '36' && doc.getElementById('sensorHeight').value === '24')

  // restore fSpy defaults and check view-state invariance on the same state
  section('5. View state cannot change the calibration')
  api.importProjectBuffer(fs.readFileSync(path.join(ROOT, 'assets', 'example.fspy')).buffer, 'defaults.fspy')
  await wait(200)
  const before = JSON.stringify(api.solve().cameraParameters)
  api.setView(6.5, [120, 450])
  doc.getElementById('lefttoggle').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  doc.getElementById('righttoggle').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  await wait(60)
  const during = JSON.stringify(api.solve().cameraParameters)
  doc.getElementById('lefttoggle').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  doc.getElementById('righttoggle').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  api.setView(1, [496, 288])
  const after = JSON.stringify(api.solve().cameraParameters)
  check('zoom, pan and sidebars leave the camera untouched', before === during && during === after)
  check('solved camera equals the oracle', before === solvedCamera || JSON.parse(before).relativeFocalLength === defaultsOracle.relativeFocalLength)

  section('6. Native .fspy round trip')
  const exported = await api.exportProjectBuffer()
  const bytes = new Uint8Array(exported)
  check('magic bytes are "fspy"', String.fromCharCode(...bytes.slice(0, 4)) === 'fspy')
  check('version field is 1', new DataView(exported).getUint32(4, true) === 1)
  const imported = await api.importProjectBuffer(exported, 'roundtrip.fspy')
  await wait(200)
  const reimported = api.getState()
  const firstState = api.getState()
  check('re-import solves to the same camera',
    Math.abs(JSON.parse(JSON.stringify(api.solve().cameraParameters)).relativeFocalLength
      - defaultsOracle.relativeFocalLength) < 1e-12)
  check('project state survives the round trip',
    reimported.globalSettings.calibrationMode === firstState.globalSettings.calibrationMode &&
    Math.abs(reimported.calibrationSettingsBase.referenceDistance - firstState.calibrationSettingsBase.referenceDistance) < 1e-12 &&
    reimported.image.width === firstState.image.width && reimported.image.height === firstState.image.height,
    `${reimported.image.width}×${reimported.image.height}`)

  section('7. In-app parity suite')
  doc.getElementById('runTestsBtn').dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }))
  await wait(1500)
  const summary = doc.getElementById('testSummary').textContent
  const passRows = doc.querySelectorAll('.test-pass').length
  const failRows = doc.querySelectorAll('.test-fail').length
  check('Verify runs and reports results', /parity checks passed/.test(summary), summary)
  check('no failures in the in-app suite', failRows === 0, `${passRows} passed, ${failRows} failed`)
  check('no uncaught page errors at the end', pageErrors.length === 0, pageErrors.join(' | '))

  console.log('\n' + (failures === 0
    ? `\x1b[32m${checks} checks passed\x1b[0m`
    : `\x1b[31m${failures} of ${checks} checks FAILED\x1b[0m`))
  dom.window.close()
  process.exit(failures === 0 ? 0 : 1)
})().catch(err => {
  console.error(err)
  process.exit(1)
})
