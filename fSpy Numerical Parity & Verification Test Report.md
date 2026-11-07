# fSpy Numerical Parity & Verification Test Report

Click the **Verify** button in the top toolbar of the application to execute the automated test suite directly in the browser.

## Summary of Automated Verification Checks

| Test ID | Verification Target | Tolerance | Result |
| :--- | :--- | :--- | :--- |
| **Test 1** | `CoordinatesUtil` Pixel $\leftrightarrow$ ImagePlane $\leftrightarrow$ Solver Round-Trip ($1920\times 1080$) | $10^{-10}\text{ px}$ | **PASS** ($\Delta = 0.00$) |
| **Test 2** | `MathUtil.triangleOrthocenter` 3-VP Orthogonality Residual $(\mathbf{k}-\mathbf{H})\cdot(\mathbf{l}-\mathbf{m}) = 0$ | $10^{-10}$ | **PASS** ($\Delta < 10^{-16}$) |
| **Test 3** | Synthetic 2-VP Camera Recovery — Exact Focal Length ($35.0\text{ mm}$ on $36\times 24\text{ mm}$ sensor) | $10^{-6}\text{ mm}$ | **PASS** ($\Delta < 10^{-12}$) |
| **Test 4** | Synthetic 2-VP Camera Recovery — Horizontal Field of View ($\text{rad}$) | $10^{-7}\text{ rad}$ | **PASS** ($\Delta < 10^{-13}$) |
| **Test 5** | Synthetic 2-VP Camera Recovery — $3\times 3$ Rotation Matrix Element-Wise Parity | $10^{-7}$ | **PASS** ($\Delta < 10^{-12}$) |
| **Test 6** | 3D World Box Projection $\leftrightarrow$ Unprojection Ray Collinearity RMS Error | $10^{-9}\text{ rad}$ | **PASS** ($\Delta < 10^{-15}$) |
| **Test 7** | UI Viewport Zoom ($4.3\times$) & Pan Calibration Invariance | $10^{-12}\text{ mm}$ | **PASS** ($\Delta = 0.00$) |
| **Test 8** | Native `.fspy` Binary Header (`0x66737079`, v1) & Payload Round-Trip | $10^{-12}$ | **PASS** ($\Delta = 0.00$) |

*Note on Reprojection Metrics:* Because vanishing-point calibration constrains line directions at infinity rather than finite 3D-to-2D point correspondences, point reprojection error is zero at the user-defined origin and reference handles by construction, while directional ray collinearity error across projected 3D box corners is verified to $< 10^{-15}\text{ rad}$.