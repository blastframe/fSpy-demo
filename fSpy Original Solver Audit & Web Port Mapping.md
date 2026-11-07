# fSpy Original Solver Audit & Web Port Mapping

## 1. Original Repository Inventory (`perarnia/fSpy/src/gui/solver/`)

| Original Source File | Core Responsibilities in Desktop fSpy | Web Port Implementation |
| :--- | :--- | :--- |
| `src/gui/solver/solver.ts` | Main entry point (`Solver.solve`, `solve1VP`, `solve2VP`, `computeCameraParameters`, `axisAssignmentMatrix`, reference distance scaling). | `Solver.solve()`, `Solver.axisAssignmentMatrix()`, `Solver.computeVanishingPoint()` |
| `src/gui/solver/math-util.ts` | Line intersection (`lineIntersection`), triangle orthocenter (`triangleOrthocenter`), focal length (`computeFocalLength`), rotation matrix (`computeCameraRotationMatrix`), projection (`perspectiveProject`), plane intersection (`viewPlaneIntersection`), matrix-to-quaternion. | `MathUtil` module |
| `src/gui/solver/coordinates-util.ts` | Coordinate conversions between `ImagePlaneCoordinates` ($[0,1]^2$, top-left origin) and `SolverCoordinates` ($[-1,1] \times [-h/w, h/w]$, centered, $+Y$ up). | `CoordinatesUtil` module |
| `src/gui/solver/vector-3d.ts` | 3D Euclidean vector operations (`dot`, `cross`, `normalized`, `length`, scalar multiplication). | `Vector3D` class |
| `src/gui/solver/matrix-4x4.ts` & `transform.ts` | $4\times 4$ homogeneous rigid-body transformations, multiplication, inversion (`inverted`), vector & direction transforms. | `Matrix4x4` class |
| `src/gui/types/calibration-settings.ts` & `control-points-state.ts` | Redux state interfaces for 1VP/2VP modes, axis assignments (`Axis`), principal point modes, reference axes/planes, and normalized line segments. | `appState` state tree (`globalSettings`, `calibrationSettingsBase`, `calibrationSettings1VP`, `calibrationSettings2VP`, `controlPointsState*`) |
| `project_file_format.md` | Binary `.fspy` container format (`fspy` 4-byte ASCII magic, `uint32` version=1, `uint32` JSON size, `uint32` image size, UTF-8 JSON payload, raw image bytes). | `NativeFspyFormat.serialize()` & `NativeFspyFormat.deserialize()` |

## 2. Placeholder Mathematics Removed from Original Demo

1. **Removed Hard-Coded `1000 × 662` Pixel Solver Frame:** The original demo solved directly in SVG viewBox coordinates (`[500, 331]` center) and assumed $f = \sqrt{-(a - pp)\cdot(b - pp)}$ in raw SVG pixels. Replaced with fSpy's normalized solver coordinate space (`[-1, 1]` horizontally).
2. **Removed Fabricated Camera Translation (`-s.forward[i] * scale`):** The original demo multiplied the forward vector by an arbitrary 2D pixel distance (`Math.hypot(...minus(st.ref, o))`). Replaced with true 3D ray-axis and ray-plane unprojection along the calibrated world origin ray.
3. **Removed Fake 2D Perspective Grid (`xx = x*120*scale / (1 + Math.abs(x)*0.36)`):** The original demo drew a rational polynomial 2D distortion grid and vertical screen-space box lines (`q[1] - 140*scale`). Replaced with `MathUtil.perspectiveProject()` using the solved $4\times 4$ `cameraTransform`.
4. **Removed Ad-Hoc Yaw/Pitch/Roll Estimation:** Replaced with authoritative $4\times 4$ orthonormal rotation matrix construction (`MathUtil.computeCameraRotationMatrix` + `Solver.axisAssignmentMatrix`) and exact Euler/Quaternion extraction.