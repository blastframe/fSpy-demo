# Native project compatibility, Blender interoperability, licences

## 1. Native `.fspy` format

Implemented per upstream `project_file_format.md` (`NativeFspyFormat` in
`index.html`).

```
offset 0   4 bytes   'f' 's' 'p' 'y'          file id
offset 4   uint32 LE project file version (1)
offset 8   uint32 LE state JSON byte length
offset 12  uint32 LE embedded image byte length (may be 0)
offset 16  N bytes   UTF-8 JSON project state
offset 16+N  M bytes  image bytes (format-agnostic blob)
```

The project state is fSpy's `SavedState`:

```
globalSettings           calibrationMode, overlay3DGuide, imageOpacity
calibrationSettingsBase  referenceDistance{Axis,Unit}, referenceDistance,
                         cameraData{presetId,presetData,customSensorWidth,customSensorHeight},
                         firstVanishingPointAxis, secondVanishingPointAxis
calibrationSettings1VP   principalPointMode, absoluteFocalLength
calibrationSettings2VP   principalPointMode, quadModeEnabled
controlPointsStateBase   principalPoint, origin, referenceDistanceAnchor,
                         referenceDistanceHandleOffsets, firstVanishingPoint
controlPointsState1VP    horizon
controlPointsState2VP    secondVanishingPoint, thirdVanishingPoint
cameraParameters         solved camera (or null)
resultDisplaySettings    fieldOfViewFormat, orientationFormat,
                         principalPointFormat, displayAbsoluteFocalLength
```

### Export

`Save .fspy` writes exactly that structure with the embedded image bytes and the
current solved `cameraParameters`, using the same header layout and
`little-endian` fields as `ProjectFile.save()`. File extension is `.fspy`,
matching `PROJECT_FILE_EXTENSION`.

### Import

`Open .fspy` accepts native files (detected by the `fspy` magic) and, as a
debugging convenience, the JSON export this app produces. On import:

- every state object is merged over this app's defaults, so partially populated
  or older projects load (upstream does the same for
  `resultDisplaySettings`/`cameraParameters`),
- the embedded image is decoded and its *real* pixel dimensions are used as
  `image.width/height` — the same values the desktop app derives,
- the legacy `Yards` reference unit is migrated to `Feet` ×3, exactly as
  `ProjectFile.load()` does,
- unknown camera presets fall back to custom sensor size,
- the camera is re-solved from the imported control points rather than trusting
  the stored `cameraParameters`, so an imported project cannot show a stale
  camera.

### Round-trip guarantees (asserted in tests)

- `serialize → deserialize` returns an identical state JSON and identical image
  bytes (`Native .fspy write -> read round trip`).
- Fixtures written by desktop fSpy import and re-solve to the same camera as the
  oracle (`FSPY_PARITY_TESTS.md`).

## 2. Blender

Blender export is **not** part of this application. The supported path is:

1. calibrate (or import) a project here,
2. `Save .fspy`,
3. open the `.fspy` file with the official
   [fSpy-Blender](https://github.com/stuffmatic/fSpy-Blender) add-on in Blender.

That works because the add-on consumes the same binary project format and the
same `cameraParameters` block (camera-to-world matrix, horizontal field of view,
relative focal length, principal point). Because the `.fspy` written here is
byte-compatible and the parameters are produced by the upstream solver, the
reconstructed Blender camera matches the desktop workflow.

What the add-on does with the data (for reference):

- `cam_data.sensor_fit = 'HORIZONTAL'`, `cam_data.angle = horizontalFieldOfView`
- principal-point lens shift normalised by `max(width, height)`
- `cam_obj.matrix_world = cameraTransform.matrix`

The earlier iteration of this demo shipped its own Blender `.py` exporter; that
has been removed in favour of the native file path, which is the interoperability
contract upstream actually promises.

A full Blender round-trip test (import the `.fspy` in Blender, render, compare
pixels) is not automated here: it requires a Blender binary with the add-on,
which is outside this repository's toolchain. The numerical part that the add-on
depends on — the camera parameters in the `.fspy` — is covered by the parity
tests.

## 3. Version assumptions

- Project file version: **1** (only version upstream writes/reads). Other
  versions are rejected with a clear message instead of being misread.
- Vendored fSpy commit: `702189ec5acbbd2c8ba492db0e52ecb5fc908f5c` (2020‑04‑14).
  `vendor/fspy/UPSTREAM_COMMIT` records this and the bundle banner repeats it.

## 4. Licences

fSpy is GPL-3.0. This repository distributes GPL-3.0 code, so it is
GPL-3.0-or-later. See `FSPY_LICENSE.md` for the file-by-file inventory and the
required notices.
