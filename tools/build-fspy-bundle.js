#!/usr/bin/env node
/**
 * Builds src/engine/fspy-engine.js from the vendored, unmodified fSpy sources
 * in vendor/fspy/src (copied verbatim from perarnia/fSpy, see vendor/fspy/UPSTREAM_COMMIT).
 *
 * No transpilation of the mathematical code happens here beyond TypeScript's
 * type erasure: the emitted JavaScript is a line-by-line equivalent of the
 * original TypeScript, with the original imports replaced by a single IIFE
 * namespace. This keeps the numerical behaviour bit-identical to upstream.
 *
 * Usage: node tools/build-fspy-bundle.js [--check]
 *   --check  rebuild in memory and fail if the committed file is stale.
 *
 * Requires network access the first time (for typescript, via npx) or a local
 * install. The generated file is committed so the demo has no build step.
 */
'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..')
const VENDOR = path.join(ROOT, 'vendor', 'fspy', 'src', 'gui')
const OUT = path.join(ROOT, 'src', 'engine', 'fspy-engine.js')

const TS_ENTRY = `'use strict'
const Solver = require('./solver/solver').default
const MathUtil = require('./solver/math-util').default
const CoordinatesUtil = require('./solver/coordinates-util').default
const CoordinatesModule = require('./solver/coordinates-util')
const Transform = require('./solver/transform').default
const Vector3D = require('./solver/vector-3d').default
const cameraModule = require('./solver/camera-presets')
const settingsTypes = require('./types/calibration-settings')
const calibrationDefaults = require('./defaults/calibration-settings')
const controlPointDefaults = require('./defaults/control-points-state')
const defaultSolverResult = require('./defaults/solver-result').default
module.exports = {
  Solver,
  MathUtil,
  CoordinatesUtil,
  ImageCoordinateFrame: CoordinatesModule.ImageCoordinateFrame,
  Transform,
  Vector3D,
  cameraPresets: cameraModule.cameraPresets,
  defaultCalibrationSettingsBase: calibrationDefaults.defaultCalibrationSettingsBase,
  defaultCalibrationSettings1VP: calibrationDefaults.defaultCalibrationSettings1VP,
  defaultCalibrationSettings2VP: calibrationDefaults.defaultCalibrationSettings2VP,
  defaultControlPointsStateBase: controlPointDefaults.defaultControlPointsStateBase,
  defaultControlPointsState1VP: controlPointDefaults.defaultControlPointsState1VP,
  defaultControlPointsState2VP: controlPointDefaults.defaultControlPointsState2VP,
  defaultSolverResult,
  Axis: settingsTypes.Axis,
  PrincipalPointMode1VP: settingsTypes.PrincipalPointMode1VP,
  PrincipalPointMode2VP: settingsTypes.PrincipalPointMode2VP,
  ReferenceDistanceUnit: settingsTypes.ReferenceDistanceUnit
}
`

function tscPath() {
  const candidates = [
    path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc'),
    path.join(ROOT, '..', 'node_modules', 'typescript', 'bin', 'tsc')
  ]
  for (const c of candidates) if (fs.existsSync(c)) return c
  throw new Error('typescript not found - run `npm install typescript esbuild` first')
}

function esbuildPath() {
  const candidates = [
    path.join(ROOT, 'node_modules'),
    path.join(ROOT, '..', 'node_modules')
  ]
  for (const c of candidates) if (fs.existsSync(path.join(c, 'esbuild'))) return path.join(c, 'esbuild')
  throw new Error('esbuild not found - run `npm install esbuild` first')
}

function build() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fspy-build-'))
  for (const dir of ['solver', 'types', 'defaults', 'strings']) {
    fs.cpSync(path.join(VENDOR, dir), path.join(tmp, dir), { recursive: true })
  }
  fs.copyFileSync(path.join(VENDOR, 'constants.ts'), path.join(tmp, 'constants.ts'))
  fs.writeFileSync(path.join(tmp, 'entry.ts'), TS_ENTRY.replace(/\.\/solver\//g, './solver/'))
  fs.writeFileSync(
    path.join(tmp, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2018',
          module: 'commonjs',
          moduleResolution: 'node',
          strict: false,
          esModuleInterop: true,
          skipLibCheck: true,
          lib: ['ES2018', 'DOM'],
          outDir: 'dist',
          rootDir: '.'
        },
        include: ['**/*.ts'],
        exclude: ['dist']
      },
      null,
      2
    )
  )

  // The only diagnostic is the Electron-only `Buffer` type in image-state.ts;
  // it is a type reference only and has no runtime effect.
  try {
    execFileSync(process.execPath, [tscPath(), '-p', tmp], { stdio: 'pipe' })
  } catch (e) {
    const out = String(e.stdout || '') + String(e.stderr || '')
    // Ignore Electron/Node-only type references (no runtime effect, and the
    // emitted JS is unaffected because these files are type-only or unused).
    const ignorable = ["Cannot find name 'Buffer'", "Cannot find name 'require'", "Cannot find name 'module'", "Cannot find name 'process'"]
    const fatal = out
      .split('\n')
      .filter((l) => l.includes('error TS') && !ignorable.some((msg) => l.includes(msg)))
    if (fatal.length > 0) throw new Error('fSpy vendored sources failed to compile:\n' + fatal.join('\n'))
  }

  const esbuild = require(esbuildPath())
  esbuild.buildSync({
    entryPoints: [path.join(tmp, 'dist', 'entry.js')],
    bundle: true,
    platform: 'browser',
    format: 'iife',
    globalName: 'FSpyOriginal',
    target: ['es2018'],
    outfile: path.join(tmp, 'out.js'),
    logLevel: 'silent'
  })

  const upstream = fs.readFileSync(path.join(ROOT, 'vendor', 'fspy', 'UPSTREAM_COMMIT'), 'utf8').trim()
  const banner = `/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Unmodified fSpy camera solver, bundled for the browser.
 * Source: https://github.com/perarnia/fSpy (commit ${upstream}, src/gui/solver,
 * src/gui/types, src/gui/defaults, src/gui/strings) - vendored under vendor/fspy.
 * fSpy is Copyright (c) 2020 Per Gantelius and licensed under the GPL-3.0.
 * This bundle is a mechanical TypeScript-erasure + module-fusion of that code;
 * see FSPY_LICENSE.md. Rebuild with: node tools/build-fspy-bundle.js
 */
`
  // esbuild stamps absolute temp paths into module comments; strip them so the
  // committed bundle is byte-stable across machines and rebuilds.
  const raw = fs.readFileSync(path.join(tmp, 'out.js'), 'utf8')
  const code = banner + raw
    .split('\n')
    .map(line => line.replace(/^\s*\/\/ .*fspy-build-[^/]*\/(dist\/)?/, '  // '))
    .map(line => line.replace(/"\.\.\/\.\.\/\.\.\/tmp\/fspy-build-[^"]*\/(dist\/)?/g, '"'))
    .join('\n')
  fs.rmSync(tmp, { recursive: true, force: true })
  return code
}

const generated = build()
if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
  if (current !== generated) {
    console.error('src/engine/fspy-engine.js is stale - rebuild with: node tools/build-fspy-bundle.js')
    process.exit(1)
  }
  console.log('src/engine/fspy-engine.js is up to date')
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, generated)
  console.log('wrote ' + path.relative(ROOT, OUT) + ' (' + generated.length + ' bytes)')
}
