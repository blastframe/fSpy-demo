# Licensing and provenance

This project incorporates source code from **fSpy** by Per Gantelius, which is
licensed under the **GNU General Public License v3.0**. The full licence text is
in `LICENSE` (an unmodified copy of upstream's `LICENSE`).

- Upstream: <https://github.com/perarnia/fSpy>
- Copyright: Copyright (c) 2020 Per Gantelius
- Commit vendored: `702189ec5acbbd2c8ba492db0e52ecb5fc908f5c` (`vendor/fspy/UPSTREAM_COMMIT`)

## 1. Incorporated files

Copied verbatim from upstream `develop` into `vendor/fspy/src/gui/`:

```
solver/aabb-ops.ts          solver/aabb.ts             solver/camera-presets.ts
solver/coordinates-util.ts  solver/math-util.ts        solver/point-2d.ts
solver/solver-result.ts     solver/solver.ts           solver/transform.ts
solver/vector-3d.ts
types/calibration-settings.ts  types/control-points-state.ts
types/global-settings.ts       types/image-state.ts
defaults/calibration-settings.ts  defaults/control-points-state.ts
defaults/solver-result.ts      defaults/global-settings.ts
constants.ts                strings/strings.ts
```

Every one of these files retains its original copyright header.

## 2. Generated artefacts

- `src/engine/fspy-engine.js` — built by `tools/build-fspy-bundle.js` from the
  files above (TypeScript type erasure + module fusion only). Its banner states
  the upstream commit, the copyright and the licence.
- `tests/fixtures/oracle.json` — numeric output of the upstream solver.

## 3. Front-end code

`index.html` (UI, rendering, project I/O, coordinate wrappers) is derivative work
of fSpy and is distributed under the same GPL-3.0-or-later terms. The 3D overlay
rendering is a port of upstream `components/control-points-panel/overlay-3d-panel.tsx`
and the native file handling follows upstream `io/project-file.ts` and
`project_file_format.md`.

## 4. Third-party assets

| Asset | Source | Licence |
| --- | --- | --- |
| `assets/example.fspy`, `assets/example.png` | upstream `test_data/defaults.fspy` | GPL-3.0 (fSpy test data) |
| `tests/fixtures/*.fspy` | upstream `test_data/` | GPL-3.0 (fSpy test data) |
| Inter, JetBrains Mono | Google Fonts CDN | SIL Open Font License 1.1 |
| Remix Icon | jsDelivr CDN | Apache License 2.0 |

## 5. Redistribution obligations

If you redistribute this application (or a build of it) you must:

1. ship the GPL-3.0 text (`LICENSE`),
2. keep the copyright notices in `vendor/fspy/**`, the banner in
   `src/engine/fspy-engine.js`, and this document,
3. make the complete corresponding source available under GPL-3.0 — which for a
   web app means the HTML/JS as served, including `vendor/fspy` and
   `tools/build-fspy-bundle.js`.

## 6. Attribution statement

The camera-calibration engine in this application is the original fSpy
implementation by Per Gantelius, used unmodified. The web front-end around it was
written for this demo. Nothing in this repository should be read as claiming that
the solver was re-implemented or newly invented here.
