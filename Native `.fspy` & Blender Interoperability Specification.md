# Native `.fspy` & Blender Interoperability Specification

## 1. Native `.fspy` Binary Format (`version = 1`)

The web application reads and writes binary `.fspy` files conforming to `project_file_format.md`:
- **Bytes `0..3`:** ASCII `'f'`, `'s'`, `'p'`, `'y'` (`[0x66, 0x73, 0x70, 0x79]`)
- **Bytes `4..7`:** `uint32` little-endian format version (`1`)
- **Bytes `8..11`:** `uint32` little-endian UTF-8 JSON state byte length ($N_{\text{json}}$)
- **Bytes `12..15`:** `uint32` little-endian embedded image byte length ($N_{\text{img}}$)
- **Bytes `16 .. 16 + N_json`:** UTF-8 JSON string containing `globalSettings`, `calibrationSettingsBase`, `calibrationSettings1VP`, `calibrationSettings2VP`, `controlPointsStateBase`, `controlPointsState1VP`, `controlPointsState2VP`.
- **Bytes `16 + N_json .. 16 + N_json + N_img`:** Binary image file bytes.

## 2. Blender Camera Reconstruction (`stuffmatic/fSpy-Blender`)

The **Export Blender .py Script** button and `.fspy` binary export follow the exact conventions of the official `fSpy-Blender` add-on:
- `cam_data.sensor_fit = 'HORIZONTAL'`
- `cam_data.angle = horizontalFieldOfView`
- Principal point lens shifts normalized by $\max(W, H)$:
  $$\text{shift\_x} = -\frac{1}{2} P_x \frac{W}{\max(W, H)}, \quad \text{shift\_y} = -\frac{1}{2} P_y \frac{W}{\max(W, H)}$$
- `cam_obj.matrix_world` is set directly to the $4\times 4$ `cameraTransform` matrix.