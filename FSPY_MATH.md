# fSpy mathematics as implemented (and as used here)

Everything below describes the *original* algorithm, as vendored in
`vendor/fspy/src/gui`. The web front-end adds no mathematics of its own.

Sections and equation numbers in upstream `solver.ts` refer to
*"Using Vanishing Points for Camera Calibration and Coarse 3D Reconstruction
from a Single Image"* (Guillou, Meneveaux, Maisel, Bouatouch).

## 1. Coordinate frames

| Frame | Definition | Where it is used |
| --- | --- | --- |
| **Screen** | CSS pixels relative to the `<svg>` element | Pointer events only |
| **Image pixel / SVG user units** | `0 ≤ x ≤ w`, `0 ≤ y ≤ h`, y down; the SVG `viewBox` is in these units | All drawing |
| **Relative** | `x / w`, `y / h`, both in `[0,1]`, y down | **Stored** in the project state (this is what `.fspy` files contain) |
| **Image plane** | Origin at the image centre, y up, long axis in `[-1,1]`. For a wide image: `x ∈ [-1,1]`, `y ∈ [-1/aspect, 1/aspect]`; for a tall image the roles swap | All solver maths |
| **Camera** | OpenGL convention: x right, y up, camera looks down **−Z** | `viewTransform`, `cameraTransform` |
| **World** | fSpy's calibrated world, axes assigned by the user | 3D guides and camera position |

Conversions are upstream `CoordinatesUtil.convert()` — the web app only wraps it
(`Coordinates.relativeToImagePlane`, `imagePlaneToRelative`, `relativeToAbsolute`,
`absoluteToRelative`, `imagePlaneToAbsolute`) plus the mirrored *viewport* frame
used by the original React UI (`relativeToViewport`, `viewportToRelative`).

`screen → image pixel` uses the live SVG CTM (`getScreenCTM().inverse()`), so it
is correct under any CSS scale, zoom or pan. **Nothing downstream of that first
conversion ever sees screen or viewport coordinates.**

## 2. Vanishing points

Two line segments per family, stored in *relative* coordinates. Upstream:

```
vp = MathUtil.lineIntersection(segment1, segment2)   // relative
vp → ImagePlane via CoordinatesUtil.convert
```

`lineIntersection` is the standard two-line determinant formula with an
`epsilon = 1e-8` degeneracy test; segments shorter than `1e-8` return `null`.
Vanishing points far outside the image, negative coordinates and very distant
points are all handled because the formula is exact (no bounding box clamps).

Warnings: `validateVanishingPointAccuracy` flags `|dot(dir1, dir2)| > 0.99995`
("Near parallel lines for VP n").

## 3. Two-vanishing-point calibration

Let `Fu`, `Fv` be the two vanishing points and `P` the principal point, all in
image plane coordinates.

**Relative focal length** (`computeFocalLength`):

```
dir      = normalize(Fu - Fv)
proj     = dot(dir, P - Fv)
Puv      = Fv + proj · dir            // orthogonal projection of P onto FuFv
f²       = |Fv − Puv| · |Fu − Puv| − |P − Puv|²
f        = √f²   (null when f² ≤ 0)
```

**Rotation** (`computeCameraRotationMatrix`, §3.3 of the paper):

```
OFu = (Fu.x − P.x, Fu.y − P.y, −f)      s1 = |OFu|,  u = OFu / s1
OFv = (Fv.x − P.x, Fv.y − P.y, −f)      s2 = |OFv|,  v = OFv / s2
w   = u × v

Moc = [ OFu.x/s1  OFv.x/s2  w.x ]
      [ OFu.y/s1  OFv.y/s2  w.y ]
      [ −f/s1     −f/s2     w.z ]
```

**Axis assignment** (`computeCameraParameters`): with `row1 = axisVector(a1)`,
`row2 = axisVector(a2)`, `row3 = row1 × row2`:

```
A = [ row1 ]
    [ row2 ]
    [ row3 ]
if |det(A) − 1| > 1e-7  →  error "Invalid axis assignment"
viewTransform = A · Moc            // world → camera
cameraTransform = viewTransform⁻¹  // camera → world
```

Because `A` is a signed permutation, axes other than X/Z (e.g. +X/−Y, +Y/+Z) are
just different `A` matrices; nothing in the maths assumes a particular pair.

**Field of view** (`computeFieldOfView`):

```
hFOV = 2·atan(1 / f)
vFOV = 2·atan((imageHeight/imageWidth) / f)
```

Note this is fSpy's normalisation, in which the *image* aspect ratio — not the
sensor aspect — enters the vertical FOV.

**Third vanishing point**: `MathUtil.thirdTriangleVertex(vp1, vp2, P)` — the
third vertex of the triangle whose orthocentre is `P`.

## 4. Principal point modes

| Mode | 1-VP | 2-VP | Definition |
| --- | --- | --- | --- |
| `Default` | yes | yes | `P = (0, 0)` (image midpoint) |
| `Manual` | yes | yes | `P` = the `principalPoint` control point, converted Relative → ImagePlane |
| `FromThirdVanishingPoint` | – | yes | `P = triangleOrthoCenter(vp1, vp2, vp3)` |

There is no other principal-point mode in fSpy. The previous demo's
"From 3rd vanishing point" support in *1-VP* mode was an invention and has been
removed; likewise its plane-based reference measurement modes.

## 5. One-vanishing-point calibration

```
sensorWidth, sensorHeight = preset ? preset.sensor : cameraData.customSensor*
aspect   = sensorWidth / sensorHeight
f        = aspect > 1 ? 2·absoluteFocalLength / sensorWidth
                       : 2·absoluteFocalLength / sensorHeight
P        = Manual ? controlPoint : (0, 0)
h        = normalize(horizon[1] − horizon[0])

if |Fu − P| < 1e-7  →  error "Failed to compute second vanishing point"
k  = −(|Fu−P|² + f²) / dot(Fu − P, h)
Fv = Fu + k·h
```

`Fv` then feeds exactly the same rotation code as the 2-VP case.

## 6. Translation and reference distance

`DEFAULT_CAMERA_DISTANCE_SCALE = 10`.

```
origin3D = 10 · ( tan(hFOV/2)·(origin.x − P.x),
                  tan(hFOV/2)·(origin.y − P.y),
                  −1 )
viewTransform[0..2][3] = origin3D
```

This places the camera such that the *world origin control point* projects back
onto itself. When a reference axis is selected:

1. `referenceDistanceHandlesWorldPositions()` intersects the two camera rays
   through the handle image positions with the plane through the reference-plane
   intersection point, using `MathUtil.shortestLineSegmentBetweenLines`
   (handle ray) and `MathUtil.linePlaneIntersection` (anchor ray / plane).
2. `scale = referenceDistance / |h0 − h1|`, and the translation is multiplied by
   `scale`.

Consequences that the UI and tests respect:

- Changing the reference distance **rescales the scene only** — rotation,
  focal length and principal point are untouched.
- With no reference axis, the scene unit is `1/10` of the camera distance
  (fSpy calls this the default camera distance; the UI marks those readouts
  "(default)" instead of pretending they are metric).
- The reference handles lie on the line from `referenceDistanceAnchor` towards
  the vanishing point of the selected axis; the state stores two *signed
  offsets* along that unit vector, which is what the drag handler writes.

## 7. Projection

`MathUtil.perspectiveProject(point, viewTransform, principalPoint, hFOV)`:

```
MVP = [ s 0 −P.x 0 ]        s = 1 / tan(hFOV / 2)
      [ 0 s −P.y 0 ]
      [ 0 0 −(f+n)/(f−n)  −2fn/(f−n) ]      n = 0.01, f = 10
      [ 0 0 −1 0 ]
projected = (MVP · viewTransform) · (x, y, z, 1)   with w-divide
```

`perspectiveUnproject` uses the inverse with the same w-divide, i.e. a true
camera ray. Both are used unchanged by the front-end (`CameraModel.
projectPoint`, `CameraModel.worldRay`).

The 3D overlays use this projection, so the grid, the unit cube and the axes
converge to exactly the same vanishing points as the calibration guides.

## 8. Rotation readouts

- **Authoritative**: `viewTransform` / `cameraTransform` (4×4).
- Quaternion (w, x, y, z) — upstream `matrixToQuaternion` returns `[x, y, z, w]`;
  the UI re-orders to (w, x, y, z) and falls back to the axis-angle form if the
  quaternion formula hits its singularity.
- Axis/angle — upstream `matrixToAxisAngle`.
- Euler XYZ — derived from `cameraTransform`, documented order: `R = Rx(x)·Ry(y)·Rz(z)`.
  These are a convenience readout only; they are not used by any other code path.

## 9. Determinism and invariance

The solver is a pure function of `(settings, control points, image width/height)`.
Viewport zoom, pan, window size, sidebar state, device pixel ratio and fullscreen
are not inputs. `tests/run-tests.js` asserts this by comparing the full camera
JSON before, during and after changing the view state.

## 10. Known fSpy behaviours that look like bugs

These are upstream behaviours, preserved deliberately:

1. **Axis-aligned cameras fail.** If the optical axis coincides exactly with a
   calibration axis, that vanishing point is at infinity and fSpy reports
   `"Failed to compute vanishing point"`. The synthetic tests therefore use a
   small roll, as real photographs do.
2. **180° roll ambiguity.** Vanishing points do not fix the *sign* along an axis,
   so the recovered rotation may differ from the generating camera by a 180°
   rotation about the optical axis (or by a combination of axis flips). fSpy's
   axis-assignment dropdown is how the user resolves this; the demo exposes the
   same dropdowns.
3. **`imageSensorProportionsMatchSensor` warnings** appear when the image aspect
   ratio does not match the selected sensor (tolerance 0.01). The web app shows
   the upstream warning instead of silently rewriting the sensor size.
4. **Reference distance handles can be pathological** when the anchor is very
   close to the vanishing point; upstream then divides by a near-zero handle
   distance. The UI shows the resulting values as-is; it does not invent a
   fallback scale.
