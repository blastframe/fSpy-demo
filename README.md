# fSpy web demo

A browser front-end for **fSpy**'s camera solver. The solver itself is the
original, unmodified fSpy TypeScript (vendored in `vendor/fspy`), so calibrated
cameras are numerically identical to the desktop app.

Open `index.html` from a local web server (the app fetches its example project
and test fixtures):

```
npm install        # only needed for the tests / rebuilds
npm run serve      # http://localhost:8080
```

## Features

- 1-VP and 2-VP calibration with every axis pairing, quad mode, all three
  principal-point modes, all camera presets and reference distances.
- Draggable perspective guides, horizon guide, world origin, principal point and
  reference-distance handles; all stored in fSpy's own relative image coordinates.
- 3D unit cube / grid planes / world axes projected through the solved camera.
- Native `.fspy` import and export (byte-compatible with the desktop app) plus a
  debug JSON export.
- Built-in parity suite (**Verify**) comparing against reference solutions
  produced by the upstream solver.

## Documentation

| File | Contents |
| --- | --- |
| `FSPY_SOLVER_AUDIT.md` | file-by-file inventory of the upstream solver and how it is executed here |
| `FSPY_MATH.md` | coordinate frames, calibration equations, projection, reference distance |
| `FSPY_PARITY_TESTS.md` | what is compared against the original solver and the results |
| `FSPY_COMPATIBILITY.md` | `.fspy` format, Blender path, version assumptions |
| `FSPY_LICENSE.md` | GPL-3.0 obligations and provenance |

## Rebuilding the engine bundle

```
npm run build:engine   # vendor/fspy -> src/engine/fspy-engine.js
npm run check:engine   # fails if the committed bundle is stale
npm test               # parity + invariance tests
```

The bundle is committed so the demo itself needs no build step.

## Licence

GPL-3.0-or-later. The solver is Copyright (c) 2020 Per Gantelius, GPL-3.0 — see
`FSPY_LICENSE.md`.
