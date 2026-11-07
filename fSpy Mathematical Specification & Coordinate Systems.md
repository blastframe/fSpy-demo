# fSpy Mathematical Specification & Coordinate Systems

## 1. Unified 7-Stage Coordinate Architecture

1. **Screen Coordinates $(x_s, y_s)$:** Browser `PointerEvent.clientX / clientY` in CSS pixels.
2. **Viewport Coordinates:** Transformed via `svg.getScreenCTM().inverse()` to account for zoom, pan, and sidebar layout without affecting image space.
3. **Image Pixel Coordinates $(x_{px}, y_{px}) \in [0, W] \times [0, H]$:** Origin at top-left of the loaded image, $+X$ right, $+Y$ down.
4. **Normalized Image Plane Coordinates $(u, v) \in [0, 1]^2$:**
   $$u = \frac{x_{px}}{W}, \quad v = \frac{y_{px}}{H}$$
   All calibration handles are stored in this resolution-independent space.
5. **Solver Coordinates $(x, y) \in [-1, 1] \times [-H/W, H/W]$:** Origin at image center, $+X$ right, $+Y$ up, image width $= 2$:
   $$x = 2u - 1, \quad y = \frac{1 - 2v}{W / H}$$
6. **Camera Coordinates $(x_c, y_c, z_c)$:** Right-handed frame at the camera optical center; $+X_c$ right, $+Y_c$ up, camera looks along $-Z_c$.
7. **World Coordinates $(X_w, Y_w, Z_w)$:** Right-handed 3D scene space with origin at the user-placed 3D origin handle and axes aligned according to the user's VP1 and VP2 axis assignments.

## 2. Two-Vanishing-Point Calibration

Given vanishing points $\mathbf{F}_u, \mathbf{F}_v$ and principal point $\mathbf{P}$ in solver coordinates:
1. **Relative Focal Length $f$:** Since the 3D rays from the optical center to orthogonal vanishing points are perpendicular:
   $$\begin{pmatrix} F_{u,x} - P_x \\ F_{u,y} - P_y \\ -f \end{pmatrix} \cdot \begin{pmatrix} F_{v,x} - P_x \\ F_{v,y} - P_y \\ -f \end{pmatrix} = 0 \implies f = \sqrt{-(\mathbf{F}_u - \mathbf{P}) \cdot (\mathbf{F}_v - \mathbf{P})}$$
2. **Principal Point from 3rd Vanishing Point:** When three mutually orthogonal vanishing points $\mathbf{F}_u, \mathbf{F}_v, \mathbf{F}_w$ are provided, $\mathbf{P}$ is the orthocenter of $\triangle \mathbf{F}_u \mathbf{F}_v \mathbf{F}_w$ (`MathUtil.triangleOrthocenter`).
3. **Camera Basis Construction:**
   $$\hat{\mathbf{u}}_c = \frac{(\mathbf{F}_u - \mathbf{P}, -f)}{\|(\mathbf{F}_u - \mathbf{P}, -f)\|}, \quad \hat{\mathbf{v}}_c = \text{orth}(\mathbf{F}_v - \mathbf{P}, -f), \quad \hat{\mathbf{w}}_c = \hat{\mathbf{u}}_c \times \hat{\mathbf{v}}_c$$
   Combined with the axis permutation matrix $M_{\text{axis}}$ mapping $(\pm X, \pm Y, \pm Z)$ to canonical world axes, the camera-to-world rotation matrix is $R_{cw} = R_{\text{cam}} M_{\text{axis}}^T$.

## 3. Camera Position & Reference Distance Scaling

Let $\hat{\mathbf{r}}_o$ be the normalized camera-space ray passing through the 2D origin handle $\mathbf{O}_{\text{solver}}$. At distance $d_o$ from the camera optical center, the world origin in camera space is $\mathbf{O}_c = d_o \hat{\mathbf{r}}_o$, so the camera position in world coordinates is:
$$\mathbf{t}_{cw} = -R_{cw} (d_o \hat{\mathbf{r}}_o)$$
When a reference distance $L_{\text{ref}}$ is specified along world axis $\hat{\mathbf{a}}_w$ (or on a world plane), the two reference handles are unprojected at unit scale ($d_o = 1$) to obtain their unscaled world separation $\Delta s$, and $d_o$ is scaled linearly by:
$$d_o = \frac{L_{\text{ref}}}{\Delta s}$$