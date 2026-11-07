#!/usr/bin/env node
/**
 * Generates/refreshes tests/fixtures/oracle.json by running the *vendored
 * upstream* fSpy solver (compiled by tools/build-fspy-bundle.js) on real
 * .fspy projects. These numbers are the reference the web app is tested
 * against, so they must never be produced by the web app itself.
 *
 * Usage: node tools/oracle.js tests/fixtures/*.fspy > tests/fixtures/oracle.json
 */
'use strict'

const fs = require('fs')
const path = require('path')

const bundlePath = path.join(__dirname, '..', 'src', 'engine', 'fspy-engine.js')
const FSpy = new Function(fs.readFileSync(bundlePath, 'utf8') + '; return FSpyOriginal;')()

function readProject(file) {
  const bytes = fs.readFileSync(file)
  if (bytes.slice(0, 4).toString() !== 'fspy') throw new Error('not an .fspy file: ' + file)
  const version = bytes.readUInt32LE(4)
  const jsonLength = bytes.readUInt32LE(8)
  const imageLength = bytes.readUInt32LE(12)
  const state = JSON.parse(bytes.slice(16, 16 + jsonLength).toString('utf8'))
  return { version, state, imageBytes: bytes.slice(16 + jsonLength, 16 + jsonLength + imageLength) }
}

/** Minimal PNG/JPEG dimension reader - the solver only needs width/height. */
function imageSize(bytes) {
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2
    while (i < bytes.length) {
      if (bytes[i] !== 0xff) { i++; continue }
      const marker = bytes[i + 1]
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: bytes.readUInt16BE(i + 5), width: bytes.readUInt16BE(i + 7) }
      }
      i += 2 + bytes.readUInt16BE(i + 2)
    }
  }
  throw new Error('unsupported image format')
}

function solve(file) {
  const { state, imageBytes } = readProject(file)
  const size = imageBytes.length ? imageSize(imageBytes) : { width: null, height: null }
  const image = { width: size.width, height: size.height, url: null, data: null }
  const mode = state.globalSettings.calibrationMode || 'TwoVanishingPoints'
  const result = mode === 'OneVanishingPoint'
    ? FSpy.Solver.solve1VP(state.calibrationSettingsBase, state.calibrationSettings1VP,
        state.controlPointsStateBase, state.controlPointsState1VP, image)
    : FSpy.Solver.solve2VP(state.calibrationSettingsBase, state.calibrationSettings2VP,
        state.controlPointsStateBase, state.controlPointsState2VP, image)
  const cam = result.cameraParameters
  return {
    mode,
    image: { w: image.width, h: image.height },
    errors: result.errors,
    warnings: result.warnings,
    cameraParameters: cam ? {
      principalPoint: cam.principalPoint,
      relativeFocalLength: cam.relativeFocalLength,
      horizontalFieldOfView: cam.horizontalFieldOfView,
      verticalFieldOfView: cam.verticalFieldOfView,
      vanishingPoints: cam.vanishingPoints,
      vanishingPointAxes: cam.vanishingPointAxes,
      viewTransform: cam.viewTransform.matrix,
      cameraTransform: cam.cameraTransform.matrix,
      imageWidth: cam.imageWidth,
      imageHeight: cam.imageHeight
    } : null
  }
}

const out = {}
for (const file of process.argv.slice(2)) {
  out[path.basename(file)] = solve(file)
}
process.stdout.write(JSON.stringify(out, null, 1) + '\n')
