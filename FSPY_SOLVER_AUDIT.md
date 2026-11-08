# fSpy solver audit and mapping

This document inventories the fSpy sources used by this demo and describes how
each piece is incorporated. The short version: **the solver is not re-implemented
here — the original TypeScript is vendored verbatim and executed in the browser.**

- Upstream repository: <https://github.com/perarnia/fSpy>
- Commit vendored: `702189ec5acbbd2c8ba492db0e52ecb5fc908f5c` (branch `develop`, 2020‑04‑14)
- Licence: GPL‑3.0 (see `FSPY_LICENSE.md`)

## 1. Vendored files (`vendor/fspy/src/gui/`)

Copied byte-for-byte from upstream. No edits, no reformatting.

| File | Responsibility |
| --- | --- |
| `solver/solver.ts` | The solver itself: `solve1VP`, `solve2VP`, `computeFocalLength`, `computeCameraRotationMatrix`, `computeFieldOfView`, `computeTranslationVector`, `referenceDistanceHandlesWorldPositions`, `referenceDistanceHandlesRelativePositions`, `vanishingPointIndexForAxis`, `axisVector`, `vectorAxis`, `imageProportionsMatchSensor`, `validateImageDimensions`, `validateVanishingPointAccuracy`, `computeVanishingPointsFromControlPoints`, `computeSecondVanishingPoint`, `blankSolverResult` |
| `solver/math-util.ts` | `lineIntersection`, `triangleOrthoCenter`, `thirdTriangleVertex`, `linePlaneIntersection`, `shortestLineSegmentBetweenLines`, `perspectiveProject`, `perspectiveUnproject`, `matrixToAxisAngle`, `matrixToQuaternion`, `modelViewProjection`, `normalized`, `dot`, `distance`, … |
| `solver/transform.ts` | 4×4 matrix type: `fromMatrix`, `inverted`, `leftMultiplied`, `transformedVector`, `determinant`, `svgString`, … |
| `solver/vector-3d.ts` | 3D vector type used by the solver |
| `solver/coordinates-util.ts` | `ImageCoordinateFrame` (Relative / Absolute / ImagePlane) and `CoordinatesUtil.convert` |
| `solver/camera-presets.ts` | Camera preset table (`sensorWidth`, `sensorHeight`, optional `focalLength`) |
| `solver/solver-result.ts` | `CameraParameters` and `SolverResult` types |
| `solver/aabb.ts`, `solver/aabb-ops.ts`, `solver/point-2d.ts` | Support types |
| `types/calibration-settings.ts` | `Axis`, `PrincipalPointMode1VP/2VP`, `ReferenceDistanceUnit`, settings interfaces |
| `types/control-points-state.ts` | Control point state model (all coordinates are *relative* image coordinates) |
| `types/image-state.ts`, `types/global-settings.ts` | Image and global settings models |
| `defaults/calibration-settings.ts`, `defaults/control-points-state.ts`, `defaults/solver-result.ts` | Upstream defaults |
| `constants.ts`, `strings/strings.ts` | `referenceDistanceAnchorEnabled`, diagnostic strings |

## 2. How the originals are executed

`tools/build-fspy-bundle.js`:

1. copies the vendored tree to a temp dir,
2. runs `tsc` with `target: ES2018` (type erasure only — no transforms),
3. bundles the emitted CommonJS with esbuild into one IIFE global,
   `FSpyOriginal`, and writes `src/engine/fspy-engine.js` (committed, so the
   demo has no build step).

`npm run check:engine` re-runs the build and fails if the committed bundle is
stale. The only compiler diagnostics ignored are Electron/Node-only *type*
references (`Buffer`, `require`, `module`) which have no runtime effect.

The page loads that bundle with a plain `<script>` tag before its own script.

## 3. What the web front-end adds (and what it must never add)

`index.html` contains **no solver mathematics**. It only:

| Front-end concern | Implementation |
| --- | --- |
| State | `createDefaultState()` mirrors the fSpy redux store 1:1 (`globalSettings`, `calibrationSettings*`, `controlPointsState*`, `image`, `resultDisplaySettings`). All control points are stored in *relative* image coordinates, so `.fspy` files round-trip untouched. |
| Solve | `Calibration.solve()` chooses `solve1VP`/`solve2VP` exactly like upstream's store and passes the image dimensions from `image.width/height`. It rejects non-finite results (defensive only). |
| Projection | `CameraModel.projectPoint()` calls upstream `MathUtil.perspectiveProject(viewTransform, principalPoint, hFOV)` and converts ImagePlane → Relative. |
| 3D guides | `renderProjectedGuides()` is a port of upstream `components/control-points-panel/overlay-3d-panel.tsx`: same `normalizationFactor` (`|translation| · atan(hFOV/2)`), same unit cube, same 10×10 grid planes, same axis lengths/colours. |
| Reference-distance handles | Uses upstream `Solver.referenceDistanceHandlesRelativePositions()` directly, so handle placement is identical to the desktop app. |
| Readouts | `absoluteFocalLength = 0.5 · sensor(long|short) · relativeFocalLength` (upstream `result-panel.tsx`), quaternion via upstream `MathUtil.matrixToQuaternion`, axis-angle via upstream `MathUtil.matrixToAxisAngle`. Euler XYZ angles are derived from `cameraTransform` and are clearly labelled as derived. |
| Project I/O | `NativeFspyFormat` implements `project_file_format.md` exactly (see `FSPY_COMPATIBILITY.md`). |

## 4. Removed placeholder code (from the previous demo)

The previous single-file demo claimed to be a port but was not numerically equal
to fSpy. It has been deleted rather than patched. Specific defects that are now
gone:

| Placeholder behaviour (old) | Now |
| --- | --- |
| Own `Solver.solve()` with `camRotMatrix = axisMatrix · R⁻¹`, axis matrix built from *row* vectors | Upstream `axisAssignmentMatrix.leftMultiplied(cameraRotationMatrix)` |
| `computeRotationMatrix` applied Gram–Schmidt and returned `axis · R` directly | Upstream `computeCameraRotationMatrix` (no Gram–Schmidt; columns are `OFu/s1`, `OFv/s2`, `up×vp`) |
| `computeFocalLength` used `-(Fu-P)·(Fv-P)` | Upstream projection-based formula (`FvPuv·FuPuv − PPuv²`) |
| Sensor size silently rewritten to match the image aspect ratio | `cameraData` is used as given; a *warning* is raised by upstream `imageProportionsMatchSensor` |
| 1-VP mode supported a "relative focal length" input and ignored the horizon in places | Upstream 1-VP path: absolute focal length + sensor → `2f/sensor`, second VP derived from the horizon guide |
| Camera distance invented (`originDistance = 5.0`), reference scaling by "intersect the axis ray" | Upstream `computeTranslationVector`: origin ray at `DEFAULT_CAMERA_DISTANCE_SCALE = 10`, then scaled by `referenceDistance / defaultHandleDistance` using `shortestLineSegmentBetweenLines` against the reference plane |
| Reference axes `xAxis/yAxis/zAxis/xyPlane/…` and a `freeReferenceSegment` | fSpy's real model: `referenceDistanceAxis: Axis | null` + `referenceDistanceAnchor` + two signed offsets along the anchor→VP line |
| 3D box/grid built from arbitrary screen-space numbers | Projected world geometry, see above |
| Two independent vanishing-point models (`vp1/vp2/vp3` recomputed in the UI) | One source: `cameraParameters.vanishingPoints` |
| Camera "position" derived from `cameraTransform` translation while on-screen axes used a *different* projection | Single camera model for readouts, overlays and export |

## 5. Trace of a single interaction

```
pointerdown on a guide handle
  → screen → SVG user units (getScreenCTM)
  → / (imageWidth, imageHeight) → relative image coordinates
  → written into appState.controlPointsState* (fSpy's own model)
  → Calibration.solve(appState)
      → Solver.solve2VP(settings, controlPoints, {width, height, …})
          → lineIntersection → CoordinatesUtil.convert(Relative→ImagePlane)
          → computeFocalLength → computeCameraRotationMatrix
          → axisAssignmentMatrix · rotation
          → computeTranslationVector (+ reference distance)
  → repaint(): overlay-3d-panel port + guide handles + readouts
```

No stage in that chain depends on the viewport transform, so zoom, pan, resize,
fullscreen and sidebar state cannot perturb the solution (asserted by the
"zoom / pan / sidebar invariance" test).
