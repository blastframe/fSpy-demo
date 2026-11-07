# Native `.fspy` Interoperability Specification

## 1. Native `.fspy` Binary Format (`version = 1`)

The web application reads and writes binary `.fspy` files conforming to `project_file_format.md`:
- **Bytes `0..3`:** ASCII `'f'`, `'s'`, `'p'`, `'y'` (`[0x66, 0x73, 0x70, 0x79]`)
- **Bytes `4..7`:** `uint32` little-endian format version (`1`)
- **Bytes `8..11`:** `uint32` little-endian UTF-8 JSON state byte length ($N_{\text{json}}$)
- **Bytes `12..15`:** `uint32` little-endian embedded image byte length ($N_{\text{img}}$)
- **Bytes `16 .. 16 + N_json`:** UTF-8 JSON string containing `globalSettings`, `calibrationSettingsBase`, `calibrationSettings1VP`, `calibrationSettings2VP`, `controlPointsStateBase`, `controlPointsState1VP`, `controlPointsState2VP`.
- **Bytes `16 + N_json .. 16 + N_json + N_img`:** Binary image file bytes.

## 2. Exposed Camera Geometry

The `.fspy` state written by this web app carries the full solved camera pose, so any consumer can reconstruct the camera without additional conventions:

- The $4\times 4$ `cameraTransform` matrix in `calibrationSettingsBase` / exported camera JSON is the camera-to-world transform (camera space looks down `-Z`, matching fSpy's original implementation).
- The principal point offset and horizontal field of view are stored per calibration settings block.
- The **Copy Camera JSON** button exposes the solved `cameraParameters` (focal length, FOV, principal point, pose, quaternion and `cameraTransform`) for external tooling.

