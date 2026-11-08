/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Unmodified fSpy camera solver, bundled for the browser.
 * Source: https://github.com/perarnia/fSpy (commit 702189ec5acbbd2c8ba492db0e52ecb5fc908f5c, src/gui/solver,
 * src/gui/types, src/gui/defaults, src/gui/strings) - vendored under vendor/fspy.
 * fSpy is Copyright (c) 2020 Per Gantelius and licensed under the GPL-3.0.
 * This bundle is a mechanical TypeScript-erasure + module-fusion of that code;
 * see FSPY_LICENSE.md. Rebuild with: node tools/build-fspy-bundle.js
 */
"use strict";
var FSpyOriginal = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // types/calibration-settings.js
  var require_calibration_settings = __commonJS({
    "types/calibration-settings.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReferenceDistanceUnit = exports.Axis = exports.PrincipalPointMode2VP = exports.PrincipalPointMode1VP = void 0;
      var PrincipalPointMode1VP;
      (function(PrincipalPointMode1VP2) {
        PrincipalPointMode1VP2["Default"] = "Default";
        PrincipalPointMode1VP2["Manual"] = "Manual";
      })(PrincipalPointMode1VP = exports.PrincipalPointMode1VP || (exports.PrincipalPointMode1VP = {}));
      var PrincipalPointMode2VP;
      (function(PrincipalPointMode2VP2) {
        PrincipalPointMode2VP2["Default"] = "Default";
        PrincipalPointMode2VP2["Manual"] = "Manual";
        PrincipalPointMode2VP2["FromThirdVanishingPoint"] = "FromThirdVanishingPoint";
      })(PrincipalPointMode2VP = exports.PrincipalPointMode2VP || (exports.PrincipalPointMode2VP = {}));
      var Axis;
      (function(Axis2) {
        Axis2["PositiveX"] = "xPositive";
        Axis2["NegativeX"] = "xNegative";
        Axis2["PositiveY"] = "yPositive";
        Axis2["NegativeY"] = "yNegative";
        Axis2["PositiveZ"] = "zPositive";
        Axis2["NegativeZ"] = "zNegative";
      })(Axis = exports.Axis || (exports.Axis = {}));
      var ReferenceDistanceUnit;
      (function(ReferenceDistanceUnit2) {
        ReferenceDistanceUnit2["None"] = "No unit";
        ReferenceDistanceUnit2["Millimeters"] = "Millimeters";
        ReferenceDistanceUnit2["Centimeters"] = "Centimeters";
        ReferenceDistanceUnit2["Meters"] = "Meters";
        ReferenceDistanceUnit2["Kilometers"] = "Kilometers";
        ReferenceDistanceUnit2["Inches"] = "Inches";
        ReferenceDistanceUnit2["Feet"] = "Feet";
        ReferenceDistanceUnit2["Miles"] = "Miles";
      })(ReferenceDistanceUnit = exports.ReferenceDistanceUnit || (exports.ReferenceDistanceUnit = {}));
    }
  });

  // solver/vector-3d.js
  var require_vector_3d = __commonJS({
    "solver/vector-3d.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Vector3D = class _Vector3D {
        constructor(x = 0, y = 0, z = 0) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        copy() {
          return new _Vector3D(this.x, this.y, this.z);
        }
        get minCoordinate() {
          return Math.min(this.x, this.y, this.z);
        }
        get maxCoordinate() {
          return Math.max(this.x, this.y, this.z);
        }
        get minAbsCoordinate() {
          return Math.min(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
        }
        get maxAbsCoordinate() {
          return Math.max(Math.abs(this.x), Math.abs(this.y), Math.abs(this.z));
        }
        add(other) {
          this.x += other.x;
          this.y += other.y;
          this.z += other.z;
        }
        added(other) {
          let result = this.copy();
          result.add(other);
          return result;
        }
        subtract(other) {
          this.x -= other.x;
          this.y -= other.y;
          this.z -= other.z;
        }
        subtracted(other) {
          let result = this.copy();
          result.subtract(other);
          return result;
        }
        get length() {
          return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        /**
         * Normalizes the vector and returns the length prior to normalization.
         */
        normalize() {
          let length = this.length;
          if (length > 0) {
            this.x /= length;
            this.y /= length;
            this.z /= length;
          }
          return length;
        }
        normalized() {
          let result = this.copy();
          result.normalize();
          return result;
        }
        negate() {
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
        }
        negated() {
          let result = this.copy();
          result.negate();
          return result;
        }
        multiplyByScalar(scalar) {
          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;
        }
        multipliedByScalar(scalar) {
          let result = this.copy();
          result.multiplyByScalar(scalar);
          return result;
        }
        /**
         * Dot product this * other
         * @param other
         */
        dot(other) {
          return this.x * other.x + this.y * other.y + this.z * other.z;
        }
        /**
         * Cross product this x other
         * @param other
         */
        cross(other) {
          return new _Vector3D(this.y * other.z - this.z * other.y, this.z * other.x - this.x * other.z, this.x * other.y - this.y * other.x);
        }
      };
      exports.default = Vector3D;
    }
  });

  // solver/aabb-ops.js
  var require_aabb_ops = __commonJS({
    "solver/aabb-ops.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var AABBOps = class {
        static width(aabb) {
          return Math.abs(aabb.xMax - aabb.xMin);
        }
        static height(aabb) {
          return Math.abs(aabb.yMax - aabb.yMin);
        }
        static maxDimension(aabb) {
          return Math.max(this.width(aabb), this.height(aabb));
        }
        static minDimension(aabb) {
          return Math.min(this.width(aabb), this.height(aabb));
        }
        static aspectRatio(aabb) {
          let height = this.height(aabb);
          if (height == 0) {
            return 0;
          }
          return this.width(aabb) / height;
        }
        static relativePosition(aabb, xRelative, yRelative) {
          return {
            x: aabb.xMin + xRelative * this.width(aabb),
            y: aabb.yMin + yRelative * this.height(aabb)
          };
        }
        static midPoint(aabb) {
          return this.relativePosition(aabb, 0.5, 0.5);
        }
        static boundingBox(points, padding = 0) {
          if (points.length == 0) {
            return { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
          }
          let xMin = points[0].x;
          let xMax = xMin;
          let yMin = points[0].y;
          let yMax = yMin;
          for (let point of points) {
            if (point.x > xMax) {
              xMax = point.x;
            } else if (point.x < xMin) {
              xMin = point.x;
            }
            if (point.y > yMax) {
              yMax = point.y;
            } else if (point.y < yMin) {
              yMin = point.y;
            }
          }
          return {
            xMin: xMin - padding,
            yMin: yMin - padding,
            xMax: xMax + padding,
            yMax: yMax + padding
          };
        }
        /**
         * Returns the largest rect with a given aspect ratio
         * that fits inside this rect.
         * @param aspectRatio
         * @param relativeOffset
         */
        static maximumInteriorAABB(aabb, aspectRatio, relativeOffset = 0.5) {
          let width = this.width(aabb);
          let height = this.height(aabb);
          if (this.aspectRatio(aabb) < aspectRatio) {
            height = this.width(aabb) / aspectRatio;
          } else {
            width = this.height(aabb) * aspectRatio;
          }
          let xMin = aabb.xMin + relativeOffset * (this.width(aabb) - width);
          let yMin = aabb.yMin + relativeOffset * (this.height(aabb) - height);
          return {
            xMin,
            yMin,
            xMax: xMin + width,
            yMax: yMin + height
          };
        }
        static containsPoint(aabb, point) {
          let xInside = point.x >= aabb.xMin && point.x <= aabb.xMax;
          let yInside = point.y >= aabb.yMin && point.y <= aabb.yMax;
          return xInside && yInside;
        }
        static overlaps(aabb1, aabb2, padding = 0) {
          let xSeparation = aabb1.xMax + padding < aabb2.xMin || aabb1.xMin - padding > aabb2.xMax;
          let ySeparation = aabb1.yMax + padding < aabb2.yMin || aabb1.yMin - padding > aabb2.yMax;
          return !xSeparation && !ySeparation;
        }
        /**
         * Returns true if aabb1 contains aabb2, false otherwise
         * @param aabb1
         * @param aabb2
         * @param padding
         */
        static contains(aabb1, aabb2) {
          let containsX = aabb1.xMin <= aabb2.xMin && aabb1.xMax >= aabb2.xMax;
          let containsY = aabb1.yMin <= aabb2.yMin && aabb1.yMax >= aabb2.yMax;
          return containsX && containsY;
        }
      };
      exports.default = AABBOps;
    }
  });

  // solver/transform.js
  var require_transform = __commonJS({
    "solver/transform.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var vector_3d_1 = __importDefault(require_vector_3d());
      var aabb_ops_1 = __importDefault(require_aabb_ops());
      var Transform = class _Transform {
        constructor() {
          this.rows = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
          ];
        }
        static lookatTransform(lookFrom, lookAt, up) {
          let forward = lookAt.subtracted(lookFrom).normalized();
          let right = forward.cross(up).normalized();
          let u = right.cross(forward);
          return _Transform.fromMatrix([
            [right.x, u.x, -forward.x, lookFrom.x],
            [right.y, u.y, -forward.y, lookFrom.y],
            [right.z, u.z, -forward.z, lookFrom.z],
            [0, 0, 0, 1]
          ]).inverted();
        }
        static perspectiveProjection(fieldOfView, near, far) {
          let s = 1 / Math.tan(0.5 * fieldOfView);
          return _Transform.fromMatrix([
            [s, 0, 0, 0],
            [0, s, 0, 0],
            [0, 0, -far / (far - near), -far * near / (far - near)],
            [0, 0, -1, 0]
          ]);
        }
        static fromMatrix(matrix) {
          let transform = new _Transform();
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            if (rowIndex >= matrix.length) {
              continue;
            }
            for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
              if (columnIndex >= matrix[rowIndex].length) {
                break;
              }
              transform.rows[rowIndex][columnIndex] = matrix[rowIndex][columnIndex];
            }
          }
          return transform;
        }
        static rotation(angle, xAxis = 0, yAxis = 0, zAxis = 1) {
          let axis = new vector_3d_1.default(xAxis, yAxis, zAxis).normalized();
          let transform = new _Transform();
          transform.rows[0][0] = Math.cos(angle) + axis.x * axis.x * (1 - Math.cos(angle));
          transform.rows[0][1] = axis.x * axis.y * (1 - Math.cos(angle)) - axis.z * Math.sin(angle);
          transform.rows[0][2] = axis.x * axis.z * (1 - Math.cos(angle)) + axis.y * Math.sin(angle);
          transform.rows[1][0] = axis.y * axis.x * (1 - Math.cos(angle)) + axis.z * Math.sin(angle);
          transform.rows[1][1] = Math.cos(angle) + axis.y * axis.y * (1 - Math.cos(angle));
          transform.rows[1][2] = axis.y * axis.z * (1 - Math.cos(angle)) - axis.x * Math.sin(angle);
          transform.rows[2][0] = axis.z * axis.x * (1 - Math.cos(angle)) - axis.y * Math.sin(angle);
          transform.rows[2][1] = axis.z * axis.y * (1 - Math.cos(angle)) + axis.x * Math.sin(angle);
          transform.rows[2][2] = Math.cos(angle) + axis.z * axis.z * (1 - Math.cos(angle));
          return transform;
        }
        static scale(sx, sy, sz = 0) {
          let transform = new _Transform();
          transform.rows[0][0] = sx;
          transform.rows[1][1] = sy;
          transform.rows[2][2] = sz;
          return transform;
        }
        static translation(dx, dy, dz = 0) {
          let transform = new _Transform();
          transform.rows[0][3] = dx;
          transform.rows[1][3] = dy;
          transform.rows[2][3] = dz;
          return transform;
        }
        static skew2D(xAngle, yAngle) {
          let transform = new _Transform();
          transform.rows[0][1] = Math.tan(xAngle);
          transform.rows[1][0] = Math.tan(yAngle);
          return transform;
        }
        /**
         * Concatenates a number of transforms. [A, B, C] => ABC
         * @param transforms [a, b, c]
         */
        static concatenate(transforms) {
          let result = new _Transform();
          for (let i = 0; i < transforms.length; i++) {
            let transform = transforms[transforms.length - 1 - i];
            result.leftMultiply(transform);
          }
          return result;
        }
        copy() {
          let copy = new _Transform();
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
              copy.matrix[rowIndex][columnIndex] = this.rows[rowIndex][columnIndex];
            }
          }
          return copy;
        }
        get matrix() {
          return this.rows;
        }
        get isIdentity() {
          for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.rows.length; columnIndex++) {
              let expectedValue = rowIndex == columnIndex ? 1 : 0;
              if (this.rows[rowIndex][columnIndex] != expectedValue) {
                return false;
              }
            }
          }
          return true;
        }
        get isDiagonal() {
          for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.rows.length; columnIndex++) {
              if (rowIndex == columnIndex) {
                if (this.rows[rowIndex][columnIndex] == 0) {
                  return false;
                }
              } else {
                if (this.rows[rowIndex][columnIndex] != 0) {
                  return false;
                }
              }
            }
          }
          return true;
        }
        get determinant() {
          let m = this.matrix;
          let m00 = m[0][0];
          let m01 = m[0][1];
          let m02 = m[0][2];
          let m03 = m[0][3];
          let m10 = m[1][0];
          let m11 = m[1][1];
          let m12 = m[1][2];
          let m13 = m[1][3];
          let m20 = m[2][0];
          let m21 = m[2][1];
          let m22 = m[2][2];
          let m23 = m[2][3];
          let m30 = m[3][0];
          let m31 = m[3][1];
          let m32 = m[3][2];
          let m33 = m[3][3];
          let result = m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 + m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 + m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 + m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 + m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 + m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
          return result;
        }
        invert() {
          let m = this.matrix;
          let m00 = m[0][0];
          let m01 = m[0][1];
          let m02 = m[0][2];
          let m03 = m[0][3];
          let m10 = m[1][0];
          let m11 = m[1][1];
          let m12 = m[1][2];
          let m13 = m[1][3];
          let m20 = m[2][0];
          let m21 = m[2][1];
          let m22 = m[2][2];
          let m23 = m[2][3];
          let m30 = m[3][0];
          let m31 = m[3][1];
          let m32 = m[3][2];
          let m33 = m[3][3];
          let s = 1 / this.determinant;
          this.rows[0][0] = m12 * m23 * m31 - m13 * m22 * m31 + m13 * m21 * m32 - m11 * m23 * m32 - m12 * m21 * m33 + m11 * m22 * m33;
          this.rows[0][1] = m03 * m22 * m31 - m02 * m23 * m31 - m03 * m21 * m32 + m01 * m23 * m32 + m02 * m21 * m33 - m01 * m22 * m33;
          this.rows[0][2] = m02 * m13 * m31 - m03 * m12 * m31 + m03 * m11 * m32 - m01 * m13 * m32 - m02 * m11 * m33 + m01 * m12 * m33;
          this.rows[0][3] = m03 * m12 * m21 - m02 * m13 * m21 - m03 * m11 * m22 + m01 * m13 * m22 + m02 * m11 * m23 - m01 * m12 * m23;
          this.rows[1][0] = m13 * m22 * m30 - m12 * m23 * m30 - m13 * m20 * m32 + m10 * m23 * m32 + m12 * m20 * m33 - m10 * m22 * m33;
          this.rows[1][1] = m02 * m23 * m30 - m03 * m22 * m30 + m03 * m20 * m32 - m00 * m23 * m32 - m02 * m20 * m33 + m00 * m22 * m33;
          this.rows[1][2] = m03 * m12 * m30 - m02 * m13 * m30 - m03 * m10 * m32 + m00 * m13 * m32 + m02 * m10 * m33 - m00 * m12 * m33;
          this.rows[1][3] = m02 * m13 * m20 - m03 * m12 * m20 + m03 * m10 * m22 - m00 * m13 * m22 - m02 * m10 * m23 + m00 * m12 * m23;
          this.rows[2][0] = m11 * m23 * m30 - m13 * m21 * m30 + m13 * m20 * m31 - m10 * m23 * m31 - m11 * m20 * m33 + m10 * m21 * m33;
          this.rows[2][1] = m03 * m21 * m30 - m01 * m23 * m30 - m03 * m20 * m31 + m00 * m23 * m31 + m01 * m20 * m33 - m00 * m21 * m33;
          this.rows[2][2] = m01 * m13 * m30 - m03 * m11 * m30 + m03 * m10 * m31 - m00 * m13 * m31 - m01 * m10 * m33 + m00 * m11 * m33;
          this.rows[2][3] = m03 * m11 * m20 - m01 * m13 * m20 - m03 * m10 * m21 + m00 * m13 * m21 + m01 * m10 * m23 - m00 * m11 * m23;
          this.rows[3][0] = m12 * m21 * m30 - m11 * m22 * m30 - m12 * m20 * m31 + m10 * m22 * m31 + m11 * m20 * m32 - m10 * m21 * m32;
          this.rows[3][1] = m01 * m22 * m30 - m02 * m21 * m30 + m02 * m20 * m31 - m00 * m22 * m31 - m01 * m20 * m32 + m00 * m21 * m32;
          this.rows[3][2] = m02 * m11 * m30 - m01 * m12 * m30 - m02 * m10 * m31 + m00 * m12 * m31 + m01 * m10 * m32 - m00 * m11 * m32;
          this.rows[3][3] = m01 * m12 * m20 - m02 * m11 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 + m00 * m11 * m22;
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
              this.rows[rowIndex][columnIndex] *= s;
            }
          }
        }
        inverted() {
          let result = this.copy();
          result.invert();
          return result;
        }
        transpose() {
          for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < rowIndex; columnIndex++) {
              let lowerValue = this.rows[rowIndex][columnIndex];
              let upperValue = this.rows[columnIndex][rowIndex];
              this.rows[rowIndex][columnIndex] = upperValue;
              this.rows[columnIndex][rowIndex] = lowerValue;
            }
          }
        }
        transposed() {
          let result = this.copy();
          result.transpose();
          return result;
        }
        transformVector(vector, perspectiveDivide = false, targetRect = null) {
          let result = this.transform([vector.x, vector.y, vector.z, 1]);
          vector.x = result[0];
          vector.y = result[1];
          vector.z = result[2];
          if (perspectiveDivide) {
            vector.x /= result[3];
            vector.y /= result[3];
            vector.z /= result[3];
          }
          if (targetRect) {
            vector.x = 0.5 * aabb_ops_1.default.width(targetRect) * vector.x + aabb_ops_1.default.midPoint(targetRect).x;
            vector.y = -0.5 * aabb_ops_1.default.height(targetRect) * vector.y + aabb_ops_1.default.midPoint(targetRect).y;
          }
        }
        transformedVector(vector, perspectiveDivide = false) {
          let copy = vector.copy();
          this.transformVector(copy, perspectiveDivide);
          return copy;
        }
        transformVectors(vectors) {
          for (let vector of vectors) {
            this.transformVector(vector);
          }
        }
        transformedVectors(vectors) {
          let result = [];
          for (let vector of vectors) {
            result.push(this.transformedVector(vector));
          }
          return result;
        }
        transform2DPoint(point) {
          let result = this.transform([point.x, point.y, 0, 1]);
          point.x = result[0];
          point.y = result[1];
        }
        transform2DPoints(points) {
          for (let point of points) {
            this.transform2DPoint(point);
          }
        }
        transformed2DPoint(point) {
          let result = this.transform([point.x, point.y, 0, 1]);
          return {
            x: result[0],
            y: result[1]
          };
        }
        transformed2DPoints(points) {
          let result = [];
          for (let point of points) {
            result.push(this.transformed2DPoint(point));
          }
          return result;
        }
        equals(transform, epsilon = 0) {
          for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
            for (let columnIndex = 0; columnIndex < this.rows[rowIndex].length; columnIndex++) {
              let thisValue = this.rows[rowIndex][columnIndex];
              let otherValue = transform.rows[rowIndex][columnIndex];
              if (epsilon == 0) {
                if (thisValue != otherValue) {
                  return false;
                }
              } else {
                if (Math.abs(thisValue - otherValue) > epsilon) {
                  return false;
                }
              }
            }
          }
          return true;
        }
        translate(dx, dy, dz = 0) {
          this.rows[0][3] += dx;
          this.rows[1][3] += dy;
          this.rows[2][3] += dz;
        }
        translated(dx, dy, dz = 0) {
          let transform = this.copy();
          transform.translate(dx, dy, dz);
          return transform;
        }
        scale(sx, sy, sz = 0) {
          this.rows[0][0] *= sx;
          this.rows[1][1] *= sy;
          this.rows[2][2] *= sz;
        }
        scaled(sx, sy, sz = 0) {
          let transform = this.copy();
          transform.scale(sx, sy, sz);
          return transform;
        }
        scaleUniform(s) {
          this.rows[0][0] *= s;
          this.rows[1][1] *= s;
          this.rows[2][2] *= s;
        }
        scaledUniform(s) {
          let transform = this.copy();
          transform.scale(s, s, s);
          return transform;
        }
        rotate(angle, xAxis = 0, yAxis = 0, zAxis = 1) {
          let rotationTransform = _Transform.rotation(angle, xAxis, yAxis, zAxis);
          this.leftMultiply(rotationTransform);
        }
        rotated(angle, xAxis = 0, yAxis = 0, zAxis = 1) {
          let transform = this.copy();
          transform.rotate(angle, xAxis, yAxis, zAxis);
          return transform;
        }
        /**
         * result = transform * this
         * @param transform
         */
        leftMultiply(transform) {
          let result = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ];
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
              let sum = 0;
              for (let srcRow = 0; srcRow < 4; srcRow++) {
                sum += this.rows[srcRow][columnIndex] * transform.rows[rowIndex][srcRow];
              }
              result[rowIndex][columnIndex] = sum;
            }
          }
          this.rows = result;
        }
        leftMultiplied(transform) {
          let result = this.copy();
          result.leftMultiply(transform);
          return result;
        }
        get svgString() {
          let a = this.rows[0][0];
          let b = this.rows[1][0];
          let c = this.rows[0][1];
          let d = this.rows[1][1];
          let e = this.rows[0][3];
          let f = this.rows[1][3];
          return "matrix(" + a + " " + b + " " + c + " " + d + " " + e + " " + f + ")";
        }
        transform(vector) {
          let result = [];
          for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
            let coord = 0;
            for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
              coord += this.rows[rowIndex][columnIndex] * vector[columnIndex];
            }
            result.push(coord);
          }
          return result;
        }
      };
      exports.default = Transform;
    }
  });

  // solver/math-util.js
  var require_math_util = __commonJS({
    "solver/math-util.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var vector_3d_1 = __importDefault(require_vector_3d());
      var transform_1 = __importDefault(require_transform());
      var MathUtil = class {
        static normalized(vector) {
          let l = this.distance({ x: 0, y: 0 }, vector);
          if (l != 0) {
            return {
              x: vector.x / l,
              y: vector.y / l
            };
          }
          return {
            x: 0,
            y: 0
          };
        }
        static dot(a, b) {
          return a.x * b.x + a.y * b.y;
        }
        static difference(a, b) {
          return {
            x: a.x - b.x,
            y: a.y - b.y
          };
        }
        static distance(a, b) {
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          return Math.sqrt(dx * dx + dy * dy);
        }
        static lineSegmentMidpoint(segment) {
          return {
            x: 0.5 * (segment[0].x + segment[1].x),
            y: 0.5 * (segment[0].y + segment[1].y)
          };
        }
        static lineIntersection(line1, line2) {
          let d1 = this.distance(line1[0], line1[1]);
          let d2 = this.distance(line2[0], line2[1]);
          let epsilon = 1e-8;
          if (Math.abs(d1) < epsilon || Math.abs(d2) < epsilon) {
            return null;
          }
          let x1 = line1[0].x;
          let y1 = line1[0].y;
          let x2 = line1[1].x;
          let y2 = line1[1].y;
          let x3 = line2[0].x;
          let y3 = line2[0].y;
          let x4 = line2[1].x;
          let y4 = line2[1].y;
          let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
          if (Math.abs(denominator) < epsilon) {
            return null;
          }
          return {
            x: ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator,
            y: ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator
          };
        }
        static triangleOrthoCenter(k, l, m) {
          let a = k.x;
          let b = k.y;
          let c = l.x;
          let d = l.y;
          let e = m.x;
          let f = m.y;
          let N = b * c + d * e + f * a - c * f - b * e - a * d;
          let x = ((d - f) * b * b + (f - b) * d * d + (b - d) * f * f + a * b * (c - e) + c * d * (e - a) + e * f * (a - c)) / N;
          let y = ((e - c) * a * a + (a - e) * c * c + (c - a) * e * e + a * b * (f - d) + c * d * (b - f) + e * f * (d - b)) / N;
          return {
            x,
            y
          };
        }
        static thirdTriangleVertex(firstVertex, secondVertex, orthocenter) {
          let a = firstVertex;
          let b = secondVertex;
          let o = orthocenter;
          let aToB = this.normalized({ x: b.x - a.x, y: b.y - a.y });
          let proj = this.dot(aToB, this.difference(o, a));
          let p = {
            x: a.x + proj * aToB.x,
            y: a.y + proj * aToB.y
          };
          let n = { x: aToB.y, y: -aToB.x };
          let h = this.dot(this.difference(a, p), this.difference(o, b)) / this.dot(n, this.difference(o, b));
          return {
            x: p.x + h * n.x,
            y: p.y + h * n.y
          };
        }
        static linePlaneIntersection(p0, p1, p2, la, lb) {
          let p01 = p1.subtracted(p0);
          let p02 = p2.subtracted(p0);
          let lab = lb.subtracted(la);
          let numerator = p01.cross(p02).dot(la.subtracted(p0));
          let denominator = -lab.dot(p01.cross(p02));
          let t = numerator / denominator;
          return new vector_3d_1.default(la.x + t * lab.x, la.y + t * lab.y, la.z + t * lab.z);
        }
        static shortestLineSegmentBetweenLines(p1, p2, p3, p4) {
          function d(m, n, o, p) {
            let allPoints = [p1, p2, p3, p4];
            let pm = allPoints[m - 1];
            let pn = allPoints[n - 1];
            let po = allPoints[o - 1];
            let pp = allPoints[p - 1];
            return (pm.x - pn.x) * (po.x - pp.x) + (pm.y - pn.y) * (po.y - pp.y) + (pm.z - pn.z) * (po.z - pp.z);
          }
          let muaNumerator = d(1, 3, 4, 3) * d(4, 3, 2, 1) - d(1, 3, 2, 1) * d(4, 3, 4, 3);
          let muaDenominator = d(2, 1, 2, 1) * d(4, 3, 4, 3) - d(4, 3, 2, 1) * d(4, 3, 2, 1);
          let mua = muaNumerator / muaDenominator;
          let mub = (d(1, 3, 4, 3) + mua * d(4, 3, 2, 1)) / d(4, 3, 4, 3);
          return [
            new vector_3d_1.default(p1.x + mua * (p2.x - p1.x), p1.y + mua * (p2.y - p1.y), p1.z + mua * (p2.z - p1.z)),
            new vector_3d_1.default(p3.x + mub * (p4.x - p3.x), p3.y + mub * (p4.y - p3.y), p3.z + mub * (p4.z - p3.z))
          ];
        }
        static perspectiveUnproject(point, viewTransform, principalPoint, horizontalFieldOfView) {
          let transform = this.modelViewProjection(viewTransform, principalPoint, horizontalFieldOfView).inverted();
          return transform.transformedVector(point, true);
        }
        static perspectiveProject(point, viewTransform, principalPoint, horizontalFieldOfView) {
          let projected = this.modelViewProjection(viewTransform, principalPoint, horizontalFieldOfView).transformedVector(point, true);
          return projected;
        }
        static pointsAreOnTheSameSideOfLine(l1, l2, p1, p2) {
          let lineDirection = {
            x: l2.x - l1.x,
            y: l2.y - l1.y
          };
          let lineNormal = {
            x: lineDirection.y,
            y: -lineDirection.x
          };
          let l1ToP1 = {
            x: p1.x - l1.x,
            y: p1.y - l1.y
          };
          let l1ToP2 = {
            x: p2.x - l1.x,
            y: p2.y - l1.y
          };
          let dot1 = l1ToP1.x * lineNormal.x + l1ToP1.y * lineNormal.y;
          let dot2 = l1ToP2.x * lineNormal.x + l1ToP2.y * lineNormal.y;
          return dot1 * dot2 > 0;
        }
        static matrixToAxisAngle(transform) {
          const m00 = transform.matrix[0][0];
          const m01 = transform.matrix[0][1];
          const m02 = transform.matrix[0][2];
          const m10 = transform.matrix[1][0];
          const m11 = transform.matrix[1][1];
          const m12 = transform.matrix[1][2];
          const m20 = transform.matrix[2][0];
          const m21 = transform.matrix[2][1];
          const m22 = transform.matrix[2][2];
          const x = (m21 - m12) / Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01));
          const y = (m02 - m20) / Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01));
          const z = (m10 - m01) / Math.sqrt((m21 - m12) * (m21 - m12) + (m02 - m20) * (m02 - m20) + (m10 - m01) * (m10 - m01));
          const angle = Math.acos((m00 + m11 + m22 - 1) / 2);
          return [x, y, z, angle];
        }
        static matrixToQuaternion(transform) {
          const m00 = transform.matrix[0][0];
          const m01 = transform.matrix[0][1];
          const m02 = transform.matrix[0][2];
          const m10 = transform.matrix[1][0];
          const m11 = transform.matrix[1][1];
          const m12 = transform.matrix[1][2];
          const m20 = transform.matrix[2][0];
          const m21 = transform.matrix[2][1];
          const m22 = transform.matrix[2][2];
          const qw = Math.sqrt(1 + m00 + m11 + m22) / 2;
          const qx = (m21 - m12) / (4 * qw);
          const qy = (m02 - m20) / (4 * qw);
          const qz = (m10 - m01) / (4 * qw);
          return [qx, qy, qz, qw];
        }
        static modelViewProjection(viewTransform, principalPoint, horizontalFieldOfView) {
          let s = 1 / Math.tan(0.5 * horizontalFieldOfView);
          let n = 0.01;
          let f = 10;
          let projectionTransform = transform_1.default.fromMatrix([
            [s, 0, -principalPoint.x, 0],
            [0, s, -principalPoint.y, 0],
            [0, 0, -(f + n) / (f - n), -2 * f * n / (f - n)],
            [0, 0, -1, 0]
          ]);
          return viewTransform.leftMultiplied(projectionTransform);
        }
      };
      exports.default = MathUtil;
    }
  });

  // solver/coordinates-util.js
  var require_coordinates_util = __commonJS({
    "solver/coordinates-util.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ImageCoordinateFrame = void 0;
      var ImageCoordinateFrame;
      (function(ImageCoordinateFrame2) {
        ImageCoordinateFrame2[ImageCoordinateFrame2["Relative"] = 0] = "Relative";
        ImageCoordinateFrame2[ImageCoordinateFrame2["Absolute"] = 1] = "Absolute";
        ImageCoordinateFrame2[ImageCoordinateFrame2["ImagePlane"] = 2] = "ImagePlane";
      })(ImageCoordinateFrame = exports.ImageCoordinateFrame || (exports.ImageCoordinateFrame = {}));
      var CoordinatesUtil = class {
        /**
         * Convert a point from one image coordinate frame to another
         * @param point The point to convert
         * @param sourceFrame The coordinate frame of the input point
         * @param targetFrame The frame to convert to
         * @param imageWidth The image width in pixels
         * @param imageHeight The image height in pixels
         */
        static convert(point, sourceFrame, targetFrame, imageWidth, imageHeight) {
          switch (sourceFrame) {
            case ImageCoordinateFrame.Absolute: {
              switch (targetFrame) {
                case ImageCoordinateFrame.Absolute:
                  return point;
                case ImageCoordinateFrame.ImagePlane:
                  let relativePoint = this.absoluteToRelative(point, imageWidth, imageHeight);
                  return this.relativeToImagePlane(relativePoint, imageWidth, imageHeight);
                case ImageCoordinateFrame.Relative:
                  return this.absoluteToRelative(point, imageWidth, imageHeight);
              }
              break;
            }
            case ImageCoordinateFrame.ImagePlane: {
              switch (targetFrame) {
                case ImageCoordinateFrame.Absolute:
                  let relativePoint = this.imagePlaneToRelative(point, imageWidth, imageHeight);
                  return this.relativeToAbsolute(relativePoint, imageWidth, imageHeight);
                case ImageCoordinateFrame.ImagePlane:
                  return point;
                case ImageCoordinateFrame.Relative:
                  return this.imagePlaneToRelative(point, imageWidth, imageHeight);
              }
              break;
            }
            case ImageCoordinateFrame.Relative: {
              switch (targetFrame) {
                case ImageCoordinateFrame.Absolute:
                  return this.relativeToAbsolute(point, imageWidth, imageHeight);
                case ImageCoordinateFrame.ImagePlane:
                  return this.relativeToImagePlane(point, imageWidth, imageHeight);
                case ImageCoordinateFrame.Relative:
                  return point;
              }
              break;
            }
          }
          throw new Error("Should not end up here");
        }
        static absoluteToRelative(point, imageWidth, imageHeight) {
          return {
            x: point.x / imageWidth,
            y: point.y / imageHeight
          };
        }
        static relativeToAbsolute(point, imageWidth, imageHeight) {
          return {
            x: point.x * imageWidth,
            y: point.y * imageHeight
          };
        }
        static relativeToImagePlane(point, imageWidth, imageHeight) {
          let aspectRatio = imageWidth / imageHeight;
          if (aspectRatio <= 1) {
            return {
              x: (-1 + 2 * point.x) * aspectRatio,
              y: 1 - 2 * point.y
            };
          } else {
            return {
              x: -1 + 2 * point.x,
              y: (1 - 2 * point.y) / aspectRatio
            };
          }
        }
        static imagePlaneToRelative(point, imageWidth, imageHeight) {
          let imageAspect = imageWidth / imageHeight;
          if (imageAspect <= 1) {
            return {
              x: 0.5 * (point.x / imageAspect + 1),
              y: 0.5 * (-point.y + 1)
            };
          } else {
            return {
              x: 0.5 * (point.x + 1),
              y: 0.5 * (-point.y * imageAspect + 1)
            };
          }
        }
      };
      exports.default = CoordinatesUtil;
    }
  });

  // defaults/solver-result.js
  var require_solver_result = __commonJS({
    "defaults/solver-result.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.defaultSolverResult = void 0;
      exports.defaultSolverResult = {
        errors: [],
        warnings: [],
        cameraParameters: null
      };
    }
  });

  // solver/camera-presets.js
  var require_camera_presets = __commonJS({
    "solver/camera-presets.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.cameraPresets = void 0;
      exports.cameraPresets = {
        "aps-c": {
          displayName: "APS-C DSLR",
          sensorWidth: 22.3,
          sensorHeight: 14.9
        },
        "canon_1d": {
          displayName: "Canon 1D",
          sensorWidth: 27.9,
          sensorHeight: 18.6
        },
        "canon_1ds": {
          displayName: "Canon 1DS",
          sensorWidth: 36,
          sensorHeight: 24
        },
        "canon_5d": {
          displayName: "Canon 5D",
          sensorWidth: 36,
          sensorHeight: 24
        },
        "canon_7d": {
          displayName: "Canon 7D",
          sensorWidth: 22.3,
          sensorHeight: 14.9
        },
        "canon_60d": {
          displayName: "Canon 60D",
          sensorWidth: 22.3,
          sensorHeight: 14.9
        },
        "canon_500d": {
          displayName: "Canon 500D",
          sensorWidth: 22.3,
          sensorHeight: 14.9
        },
        "canon_550d": {
          displayName: "Canon 550D",
          sensorWidth: 22.3,
          sensorHeight: 14.9
        },
        "canon_600d": {
          displayName: "Canon 600D",
          sensorWidth: 22.3,
          sensorHeight: 14.9
        },
        "canon_1100d": {
          displayName: "Canon 1100D",
          sensorWidth: 22.2,
          sensorHeight: 14.7
        },
        "canon_g7x_mk2": {
          displayName: "Canon G7X Mark II",
          sensorWidth: 13.2,
          sensorHeight: 8.8
        },
        "35_mm_film": {
          displayName: "35 mm film",
          sensorWidth: 36,
          sensorHeight: 24
        },
        "micro_4_3rds": {
          displayName: "Micro four thirds",
          sensorWidth: 17.3,
          sensorHeight: 14
        },
        "nikon_d3s": {
          displayName: "Nikon D3S",
          sensorWidth: 36,
          sensorHeight: 23.9
        },
        "nikon_d90": {
          displayName: "Nikon D90",
          sensorWidth: 23.6,
          sensorHeight: 15.8
        },
        "nikon_d300s": {
          displayName: "Nikon D300S",
          sensorWidth: 23.6,
          sensorHeight: 15.8
        },
        "nikon_d3100": {
          displayName: "Nikon D3100",
          sensorWidth: 23.1,
          sensorHeight: 15.4
        },
        "nikon_d5000": {
          displayName: "Nikon D5000",
          sensorWidth: 23.6,
          sensorHeight: 15.8
        },
        "nikon_d5100": {
          displayName: "Nikon D5100",
          sensorWidth: 23.6,
          sensorHeight: 15.6
        },
        "nikon_d7000": {
          displayName: "Nikon D7000",
          sensorWidth: 23.6,
          sensorHeight: 15.6
        },
        "red_epic": {
          displayName: "Red Epic",
          sensorWidth: 30,
          sensorHeight: 15
        },
        "red_epic_2k": {
          displayName: "Red Epic 2k",
          sensorWidth: 11.1,
          sensorHeight: 6.24
        },
        "red_epic_3k": {
          displayName: "Red Epic 3k",
          sensorWidth: 16.65,
          sensorHeight: 9.36
        },
        "red_epic_4k": {
          displayName: "Red Epic 4k",
          sensorWidth: 22.2,
          sensorHeight: 12.6
        },
        "sony_a55": {
          displayName: "Sony A55",
          sensorWidth: 23.4,
          sensorHeight: 15.6
        },
        "iphone_6s": {
          displayName: "iPhone 6S",
          sensorWidth: 4.8,
          sensorHeight: 3.6,
          focalLength: 4.15
        }
      };
    }
  });

  // strings/strings.js
  var require_strings = __commonJS({
    "strings/strings.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var strings = {
        customCameraPresetName: "Custom camera",
        unitMm: "mm",
        imageSensorProportionsMismatch: "Image/sensor proportions mismatch"
      };
      exports.default = strings;
    }
  });

  // solver/solver.js
  var require_solver = __commonJS({
    "solver/solver.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      });
      var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      } : function(o, v) {
        o["default"] = v;
      });
      var __importStar = exports && exports.__importStar || function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var calibration_settings_1 = require_calibration_settings();
      var math_util_1 = __importDefault(require_math_util());
      var transform_1 = __importDefault(require_transform());
      var vector_3d_1 = __importDefault(require_vector_3d());
      var coordinates_util_1 = __importStar(require_coordinates_util());
      var solver_result_1 = require_solver_result();
      var camera_presets_1 = require_camera_presets();
      var strings_1 = __importDefault(require_strings());
      var Solver = class {
        /**
         * Estimates camera parameters given a single vanishing point, a
         * relative focal length and an optional horizon direction
         * @param settings
         * @param controlPoints
         * @param image
         */
        static solve1VP(settingsBase, settings1VP, controlPointsBase, controlPoints1VP, image) {
          let result = this.blankSolverResult();
          result.errors = this.validateImageDimensions(image);
          if (result.errors.length > 0) {
            return result;
          }
          let imageWidth = image.width;
          let imageHeight = image.height;
          let absoluteFocalLength = settings1VP.absoluteFocalLength;
          let sensorWidth = settingsBase.cameraData.customSensorWidth;
          let sensorHeight = settingsBase.cameraData.customSensorHeight;
          let presetId = settingsBase.cameraData.presetId;
          if (presetId) {
            let preset = camera_presets_1.cameraPresets[presetId];
            sensorWidth = preset.sensorWidth;
            sensorHeight = preset.sensorHeight;
          }
          let relativeFocalLength = 0;
          let sensorAspectRatio = sensorWidth / sensorHeight;
          if (sensorAspectRatio > 1) {
            relativeFocalLength = 2 * absoluteFocalLength / sensorWidth;
          } else {
            relativeFocalLength = 2 * absoluteFocalLength / sensorHeight;
          }
          if (!this.imageProportionsMatchSensor(sensorWidth, sensorHeight, imageWidth, imageHeight)) {
            result.warnings.push(strings_1.default.imageSensorProportionsMismatch);
          }
          const vanishingPointStates = [controlPointsBase.firstVanishingPoint];
          let inputVanishingPoints = this.computeVanishingPointsFromControlPoints(image, vanishingPointStates, result.errors);
          this.validateVanishingPointAccuracy(vanishingPointStates, result.warnings);
          if (result.errors.length > 0) {
            return result;
          }
          let principalPoint = { x: 0, y: 0 };
          if (settings1VP.principalPointMode == calibration_settings_1.PrincipalPointMode1VP.Manual) {
            principalPoint = coordinates_util_1.default.convert(controlPointsBase.principalPoint, coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight);
          }
          let horizonDirection = { x: 1, y: 0 };
          let horizonStart = coordinates_util_1.default.convert(controlPoints1VP.horizon[0], coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight);
          let horizonEnd = coordinates_util_1.default.convert(controlPoints1VP.horizon[1], coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight);
          horizonDirection = math_util_1.default.normalized({
            x: horizonEnd.x - horizonStart.x,
            y: horizonEnd.y - horizonStart.y
          });
          let secondVanishingPoint = this.computeSecondVanishingPoint(inputVanishingPoints[0], relativeFocalLength, principalPoint, horizonDirection);
          if (secondVanishingPoint === null) {
            result.errors.push("Failed to compute second vanishing point");
            return result;
          }
          result.cameraParameters = this.computeCameraParameters(result, controlPointsBase, settingsBase, principalPoint, inputVanishingPoints[0], secondVanishingPoint, relativeFocalLength, imageWidth, imageHeight);
          return result;
        }
        static solve2VP(settingsBase, settings2VP, controlPointsBase, controlPoints2VP, image) {
          let result = this.blankSolverResult();
          let errors = this.validateImageDimensions(image);
          if (errors.length > 0) {
            result.errors = errors;
            return result;
          }
          let imageWidth = image.width;
          let imageHeight = image.height;
          let firstVanishingPointControlState = controlPointsBase.firstVanishingPoint;
          let secondVanishingPointControlState = controlPoints2VP.secondVanishingPoint;
          if (settings2VP.quadModeEnabled) {
            secondVanishingPointControlState = {
              lineSegments: [
                [
                  firstVanishingPointControlState.lineSegments[0][0],
                  firstVanishingPointControlState.lineSegments[1][0]
                ],
                [
                  firstVanishingPointControlState.lineSegments[0][1],
                  firstVanishingPointControlState.lineSegments[1][1]
                ]
              ]
            };
          }
          let inputVanishingPoints = this.computeVanishingPointsFromControlPoints(image, [controlPointsBase.firstVanishingPoint, secondVanishingPointControlState], errors);
          if (!inputVanishingPoints) {
            result.errors = errors;
            return result;
          }
          let principalPoint = { x: 0, y: 0 };
          switch (settings2VP.principalPointMode) {
            case calibration_settings_1.PrincipalPointMode2VP.Manual:
              principalPoint = coordinates_util_1.default.convert(controlPointsBase.principalPoint, coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, image.width, image.height);
              break;
            case calibration_settings_1.PrincipalPointMode2VP.FromThirdVanishingPoint:
              let thirdVanishingPointArray = this.computeVanishingPointsFromControlPoints(image, [controlPoints2VP.thirdVanishingPoint], errors);
              if (thirdVanishingPointArray) {
                let thirdVanishingPoint = thirdVanishingPointArray[0];
                principalPoint = math_util_1.default.triangleOrthoCenter(inputVanishingPoints[0], inputVanishingPoints[1], thirdVanishingPoint);
              }
              break;
          }
          let fRelative = this.computeFocalLength(inputVanishingPoints[0], inputVanishingPoints[1], principalPoint);
          if (fRelative === null) {
            result.errors.push("Invalid vanishing point configuration. Failed to compute focal length.");
            return result;
          }
          const vanishingPointStatesToCheck = [controlPointsBase.firstVanishingPoint, secondVanishingPointControlState];
          if (settings2VP.principalPointMode == calibration_settings_1.PrincipalPointMode2VP.FromThirdVanishingPoint) {
            vanishingPointStatesToCheck.push(controlPoints2VP.thirdVanishingPoint);
          }
          this.validateVanishingPointAccuracy(vanishingPointStatesToCheck, result.warnings);
          result.cameraParameters = this.computeCameraParameters(result, controlPointsBase, settingsBase, principalPoint, inputVanishingPoints[0], inputVanishingPoints[1], fRelative, imageWidth, imageHeight);
          return result;
        }
        static imageProportionsMatchSensor(imageWidth, imageHeight, sensorWidth, sensorHeight) {
          if (sensorHeight == 0 || sensorWidth == 0 || imageWidth == 0 || imageHeight == 0) {
            return false;
          }
          const epsilon = 0.01;
          const imageAspectRatio = imageWidth / imageHeight;
          const sensorAspectRatio = sensorWidth / sensorHeight;
          const imageFitsSensor = Math.abs(sensorAspectRatio - imageAspectRatio) < epsilon;
          const rotated90DegImageFitsSensor = Math.abs(sensorAspectRatio - 1 / imageAspectRatio) < epsilon;
          if (!imageFitsSensor && !rotated90DegImageFitsSensor) {
            return false;
          }
          return true;
        }
        /**
         * Computes the focal length based on two vanishing points and a center of projection.
         * See 3.2 "Determining the focal length from a single image"
         * @param Fu the first vanishing point in image plane coordinates.
         * @param Fv the second vanishing point in image plane coordinates.
         * @param P the center of projection in image plane coordinates.
         * @returns The relative focal length.
         */
        static computeFocalLength(Fu, Fv, P) {
          let dirFuFv = new vector_3d_1.default(Fu.x - Fv.x, Fu.y - Fv.y).normalized();
          let FvP = new vector_3d_1.default(P.x - Fv.x, P.y - Fv.y);
          let proj = dirFuFv.dot(FvP);
          let Puv = {
            x: proj * dirFuFv.x + Fv.x,
            y: proj * dirFuFv.y + Fv.y
          };
          let PPuv = new vector_3d_1.default(P.x - Puv.x, P.y - Puv.y).length;
          let FvPuv = new vector_3d_1.default(Fv.x - Puv.x, Fv.y - Puv.y).length;
          let FuPuv = new vector_3d_1.default(Fu.x - Puv.x, Fu.y - Puv.y).length;
          let fSq = FvPuv * FuPuv - PPuv * PPuv;
          if (fSq <= 0) {
            return null;
          }
          return Math.sqrt(fSq);
        }
        /**
         * Computes the camera rotation matrix based on two vanishing points
         * and a focal length as in section 3.3 "Computing the rotation matrix".
         * @param Fu the first vanishing point in normalized image coordinates.
         * @param Fv the second vanishing point in normalized image coordinates.
         * @param f the relative focal length.
         * @param P the principal point
         * @returns The matrix Moc
         */
        static computeCameraRotationMatrix(Fu, Fv, f, P) {
          let OFu = new vector_3d_1.default(Fu.x - P.x, Fu.y - P.y, -f);
          let OFv = new vector_3d_1.default(Fv.x - P.x, Fv.y - P.y, -f);
          let s1 = OFu.length;
          let upRc = OFu.normalized();
          let s2 = OFv.length;
          let vpRc = OFv.normalized();
          let wpRc = upRc.cross(vpRc);
          let M = new transform_1.default();
          M.matrix[0][0] = OFu.x / s1;
          M.matrix[0][1] = OFv.x / s2;
          M.matrix[0][2] = wpRc.x;
          M.matrix[1][0] = OFu.y / s1;
          M.matrix[1][1] = OFv.y / s2;
          M.matrix[1][2] = wpRc.y;
          M.matrix[2][0] = -f / s1;
          M.matrix[2][1] = -f / s2;
          M.matrix[2][2] = wpRc.z;
          return M;
        }
        static vanishingPointIndexForAxis(positiveAxis, vanishingPointAxes) {
          let negativeAxis = calibration_settings_1.Axis.NegativeX;
          switch (positiveAxis) {
            case calibration_settings_1.Axis.PositiveY:
              negativeAxis = calibration_settings_1.Axis.NegativeY;
              break;
            case calibration_settings_1.Axis.PositiveZ:
              negativeAxis = calibration_settings_1.Axis.NegativeZ;
              break;
          }
          for (let vpIndex = 0; vpIndex < 3; vpIndex++) {
            let vpAxis = vanishingPointAxes[vpIndex];
            if (vpAxis == positiveAxis || vpAxis == negativeAxis) {
              return vpIndex;
            }
          }
          return 0;
        }
        static referenceDistanceHandlesWorldPositions(controlPoints, referenceAxis, imageWidth, imageHeight, cameraParameters) {
          let handlePositionsRelative = this.referenceDistanceHandlesRelativePositions(controlPoints, referenceAxis, cameraParameters.vanishingPoints, cameraParameters.vanishingPointAxes, imageWidth, imageHeight);
          let handlePositions = [
            coordinates_util_1.default.convert(handlePositionsRelative[0], coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight),
            coordinates_util_1.default.convert(handlePositionsRelative[1], coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight)
          ];
          let anchorPosition = coordinates_util_1.default.convert(controlPoints.referenceDistanceAnchor, coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight);
          let origin = new vector_3d_1.default();
          let u = new vector_3d_1.default();
          let v = new vector_3d_1.default();
          let w = new vector_3d_1.default();
          switch (referenceAxis) {
            case calibration_settings_1.Axis.PositiveX:
              u.y = 1;
              v.z = 1;
              w.x = 1;
              break;
            case calibration_settings_1.Axis.PositiveY:
              u.x = 1;
              v.z = 1;
              w.y = 1;
              break;
            case calibration_settings_1.Axis.PositiveZ:
              u.x = 1;
              v.y = 1;
              w.z = 1;
              break;
          }
          let rayAnchorStart = math_util_1.default.perspectiveUnproject(new vector_3d_1.default(anchorPosition.x, anchorPosition.y, 1), cameraParameters.viewTransform, cameraParameters.principalPoint, cameraParameters.horizontalFieldOfView);
          let rayAnchorEnd = math_util_1.default.perspectiveUnproject(new vector_3d_1.default(anchorPosition.x, anchorPosition.y, 2), cameraParameters.viewTransform, cameraParameters.principalPoint, cameraParameters.horizontalFieldOfView);
          let referencePlaneIntersection = math_util_1.default.linePlaneIntersection(origin, u, v, rayAnchorStart, rayAnchorEnd);
          let result = [];
          for (let handlePosition of handlePositions) {
            let handleRayStart = math_util_1.default.perspectiveUnproject(new vector_3d_1.default(handlePosition.x, handlePosition.y, 1), cameraParameters.viewTransform, cameraParameters.principalPoint, cameraParameters.horizontalFieldOfView);
            let handleRayEnd = math_util_1.default.perspectiveUnproject(new vector_3d_1.default(handlePosition.x, handlePosition.y, 2), cameraParameters.viewTransform, cameraParameters.principalPoint, cameraParameters.horizontalFieldOfView);
            let handlePosition3D = math_util_1.default.shortestLineSegmentBetweenLines(handleRayStart, handleRayEnd, referencePlaneIntersection, referencePlaneIntersection.added(w))[0];
            result.push(handlePosition3D);
          }
          return [result[0], result[1]];
        }
        static referenceDistanceHandlesRelativePositions(controlPoints, referenceAxis, vanishingPoints, vanishingPointAxes, imageWidth, imageHeight) {
          let anchor = controlPoints.referenceDistanceAnchor;
          let vpIndex = this.vanishingPointIndexForAxis(referenceAxis, vanishingPointAxes);
          let vp = coordinates_util_1.default.convert(vanishingPoints[vpIndex], coordinates_util_1.ImageCoordinateFrame.ImagePlane, coordinates_util_1.ImageCoordinateFrame.Relative, imageWidth, imageHeight);
          let anchorToVp = math_util_1.default.normalized({ x: vp.x - anchor.x, y: vp.y - anchor.y });
          let handleOffsets = controlPoints.referenceDistanceHandleOffsets;
          return [
            {
              x: anchor.x + handleOffsets[0] * anchorToVp.x,
              y: anchor.y + handleOffsets[0] * anchorToVp.y
            },
            {
              x: anchor.x + handleOffsets[1] * anchorToVp.x,
              y: anchor.y + handleOffsets[1] * anchorToVp.y
            }
          ];
        }
        /**
         * Computes the coordinates of the second vanishing point
         * based on the first, a focal length, the center of projection and
         * the desired horizon tilt angle. The equations here are derived from
         * section 3.2 "Determining the focal length from a single image".
         * @param Fu the first vanishing point in image plane coordinates.
         * @param f the relative focal length
         * @param P the center of projection in normalized image coordinates
         * @param horizonDir The desired horizon direction
         */
        static computeSecondVanishingPoint(Fu, f, P, horizonDir) {
          if (math_util_1.default.distance(Fu, P) < 1e-7) {
            return null;
          }
          let Fup = {
            x: Fu.x - P.x,
            y: Fu.y - P.y
          };
          let k = -(Fup.x * Fup.x + Fup.y * Fup.y + f * f) / (Fup.x * horizonDir.x + Fup.y * horizonDir.y);
          let Fv = {
            x: Fup.x + k * horizonDir.x + P.x,
            y: Fup.y + k * horizonDir.y + P.y
          };
          return Fv;
        }
        static axisVector(axis) {
          switch (axis) {
            case calibration_settings_1.Axis.NegativeX:
              return new vector_3d_1.default(-1, 0, 0);
            case calibration_settings_1.Axis.PositiveX:
              return new vector_3d_1.default(1, 0, 0);
            case calibration_settings_1.Axis.NegativeY:
              return new vector_3d_1.default(0, -1, 0);
            case calibration_settings_1.Axis.PositiveY:
              return new vector_3d_1.default(0, 1, 0);
            case calibration_settings_1.Axis.NegativeZ:
              return new vector_3d_1.default(0, 0, -1);
            case calibration_settings_1.Axis.PositiveZ:
              return new vector_3d_1.default(0, 0, 1);
          }
        }
        static vectorAxis(vector) {
          if (vector.x == 0 && vector.y == 0) {
            return vector.z > 0 ? calibration_settings_1.Axis.PositiveZ : calibration_settings_1.Axis.NegativeZ;
          } else if (vector.x == 0 && vector.z == 0) {
            return vector.y > 0 ? calibration_settings_1.Axis.PositiveY : calibration_settings_1.Axis.NegativeY;
          } else if (vector.y == 0 && vector.z == 0) {
            return vector.x > 0 ? calibration_settings_1.Axis.PositiveX : calibration_settings_1.Axis.NegativeX;
          }
          throw new Error("Invalid axis vector");
        }
        static validateImageDimensions(image) {
          let errors = [];
          if (image.width === null || image.height === null) {
            errors.push("No image loaded");
          }
          return errors;
        }
        static validateVanishingPointAccuracy(controlPointStates, warnings) {
          controlPointStates.forEach((controlPointState, stateIndex) => {
            const line1Direction = math_util_1.default.normalized(math_util_1.default.difference(controlPointState.lineSegments[0][1], controlPointState.lineSegments[0][0]));
            const line2Direction = math_util_1.default.normalized(math_util_1.default.difference(controlPointState.lineSegments[1][1], controlPointState.lineSegments[1][0]));
            const dot = math_util_1.default.dot(line1Direction, line2Direction);
            if (Math.abs(dot) > 0.99995) {
              warnings.push("Near parallel lines for VP " + (stateIndex + 1));
            }
          });
        }
        /**
         * Computes vanishing points in image plane coordinates given a set of
         * vanishing point control points.
         * @param image
         * @param controlPointStates
         * @param errors
         */
        static computeVanishingPointsFromControlPoints(image, controlPointStates, errors) {
          let result = [];
          for (let i = 0; i < controlPointStates.length; i++) {
            let vanishingPoint = math_util_1.default.lineIntersection(controlPointStates[i].lineSegments[0], controlPointStates[i].lineSegments[1]);
            if (vanishingPoint) {
              result.push(coordinates_util_1.default.convert(vanishingPoint, coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, image.width, image.height));
            } else {
              errors.push("Failed to compute vanishing point");
            }
          }
          return errors.length == 0 ? result : null;
        }
        static computeTranslationVector(controlPoints, settings, imageWidth, imageHeight, cameraParameters) {
          let origin = coordinates_util_1.default.convert(controlPoints.origin, coordinates_util_1.ImageCoordinateFrame.Relative, coordinates_util_1.ImageCoordinateFrame.ImagePlane, imageWidth, imageHeight);
          let k = Math.tan(0.5 * cameraParameters.horizontalFieldOfView);
          let origin3D = new vector_3d_1.default(k * (origin.x - cameraParameters.principalPoint.x), k * (origin.y - cameraParameters.principalPoint.y), -1).multipliedByScalar(this.DEFAULT_CAMERA_DISTANCE_SCALE);
          cameraParameters.viewTransform.matrix[0][3] = origin3D.x;
          cameraParameters.viewTransform.matrix[1][3] = origin3D.y;
          cameraParameters.viewTransform.matrix[2][3] = origin3D.z;
          if (settings.referenceDistanceAxis) {
            let referenceDistanceHandles3D = this.referenceDistanceHandlesWorldPositions(controlPoints, settings.referenceDistanceAxis, imageWidth, imageHeight, cameraParameters);
            let defaultHandleDistance = referenceDistanceHandles3D[0].subtracted(referenceDistanceHandles3D[1]).length;
            let referenceDistance = settings.referenceDistance;
            let scale = referenceDistance / defaultHandleDistance;
            origin3D.multiplyByScalar(scale);
          }
          cameraParameters.viewTransform.matrix[0][3] = origin3D.x;
          cameraParameters.viewTransform.matrix[1][3] = origin3D.y;
          cameraParameters.viewTransform.matrix[2][3] = origin3D.z;
        }
        /**
         * Creates a blank solver result to be populated by the solver
         */
        static blankSolverResult() {
          let result = { ...solver_result_1.defaultSolverResult };
          result.errors = [];
          result.warnings = [];
          return result;
        }
        static computeFieldOfView(imageWidth, imageHeight, fRelative, vertical) {
          let aspectRatio = imageWidth / imageHeight;
          let d = vertical ? 1 / aspectRatio : 1;
          return 2 * Math.atan(d / fRelative);
        }
        static computeCameraParameters(result, controlPoints, settings, principalPoint, vp1, vp2, relativeFocalLength, imageWidth, imageHeight) {
          let cameraParameters = {
            principalPoint: { x: 0, y: 0 },
            viewTransform: new transform_1.default(),
            cameraTransform: new transform_1.default(),
            horizontalFieldOfView: 0,
            verticalFieldOfView: 0,
            vanishingPoints: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
            vanishingPointAxes: [calibration_settings_1.Axis.NegativeX, calibration_settings_1.Axis.NegativeX, calibration_settings_1.Axis.NegativeX],
            relativeFocalLength: 0,
            imageWidth,
            imageHeight
          };
          let axisAssignmentMatrix = new transform_1.default();
          let row1 = this.axisVector(settings.firstVanishingPointAxis);
          let row2 = this.axisVector(settings.secondVanishingPointAxis);
          let row3 = row1.cross(row2);
          axisAssignmentMatrix.matrix[0][0] = row1.x;
          axisAssignmentMatrix.matrix[0][1] = row1.y;
          axisAssignmentMatrix.matrix[0][2] = row1.z;
          axisAssignmentMatrix.matrix[1][0] = row2.x;
          axisAssignmentMatrix.matrix[1][1] = row2.y;
          axisAssignmentMatrix.matrix[1][2] = row2.z;
          axisAssignmentMatrix.matrix[2][0] = row3.x;
          axisAssignmentMatrix.matrix[2][1] = row3.y;
          axisAssignmentMatrix.matrix[2][2] = row3.z;
          if (Math.abs(1 - axisAssignmentMatrix.determinant) > 1e-7) {
            result.errors.push("Invalid axis assignment");
            return null;
          }
          cameraParameters.vanishingPointAxes = [
            settings.firstVanishingPointAxis,
            settings.secondVanishingPointAxis,
            this.vectorAxis(row3)
          ];
          cameraParameters.principalPoint = principalPoint;
          cameraParameters.relativeFocalLength = relativeFocalLength;
          cameraParameters.vanishingPoints = [
            vp1,
            vp2,
            math_util_1.default.thirdTriangleVertex(vp1, vp2, principalPoint)
          ];
          cameraParameters.horizontalFieldOfView = this.computeFieldOfView(imageWidth, imageHeight, relativeFocalLength, false);
          cameraParameters.verticalFieldOfView = this.computeFieldOfView(imageWidth, imageHeight, relativeFocalLength, true);
          let cameraRotationMatrix = this.computeCameraRotationMatrix(vp1, vp2, relativeFocalLength, principalPoint);
          if (Math.abs(cameraRotationMatrix.determinant - 1) > 1e-7) {
            result.errors.push("Invalid vanishing point configuration. Rotation determinant " + cameraRotationMatrix.determinant.toFixed(5));
            return null;
          }
          cameraParameters.viewTransform = axisAssignmentMatrix.leftMultiplied(cameraRotationMatrix);
          this.computeTranslationVector(controlPoints, settings, imageWidth, imageHeight, cameraParameters);
          cameraParameters.cameraTransform = cameraParameters.viewTransform.inverted();
          return cameraParameters;
        }
      };
      exports.default = Solver;
      Solver.DEFAULT_CAMERA_DISTANCE_SCALE = 10;
    }
  });

  // defaults/calibration-settings.js
  var require_calibration_settings2 = __commonJS({
    "defaults/calibration-settings.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.defaultCalibrationSettings2VP = exports.defaultCalibrationSettings1VP = exports.defaultCalibrationSettingsBase = void 0;
      var calibration_settings_1 = require_calibration_settings();
      exports.defaultCalibrationSettingsBase = {
        referenceDistanceAxis: null,
        referenceDistance: 4,
        referenceDistanceUnit: calibration_settings_1.ReferenceDistanceUnit.Meters,
        cameraData: {
          presetId: null,
          presetData: null,
          customSensorWidth: 36,
          customSensorHeight: 24
        },
        firstVanishingPointAxis: calibration_settings_1.Axis.PositiveX,
        secondVanishingPointAxis: calibration_settings_1.Axis.PositiveY
      };
      exports.defaultCalibrationSettings1VP = {
        principalPointMode: calibration_settings_1.PrincipalPointMode1VP.Default,
        absoluteFocalLength: 24
      };
      exports.defaultCalibrationSettings2VP = {
        principalPointMode: calibration_settings_1.PrincipalPointMode2VP.Default,
        quadModeEnabled: false
      };
    }
  });

  // constants.js
  var require_constants = __commonJS({
    "constants.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var Constants = class {
      };
      exports.default = Constants;
      Constants.referenceDistanceAnchorEnabled = false;
    }
  });

  // defaults/control-points-state.js
  var require_control_points_state = __commonJS({
    "defaults/control-points-state.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.defaultControlPointsState2VP = exports.defaultControlPointsState1VP = exports.defaultControlPointsStateBase = void 0;
      var constants_1 = __importDefault(require_constants());
      var defaultOrigin = {
        x: 0.602536594761171,
        y: 0.36081762673040585
      };
      var defaultReferenceDistanceAnchor = {
        x: 0.5080116846430406,
        y: 0.6779647921622778
      };
      exports.defaultControlPointsStateBase = {
        principalPoint: {
          x: 0.5,
          y: 0.5
        },
        origin: defaultOrigin,
        referenceDistanceAnchor: constants_1.default.referenceDistanceAnchorEnabled ? defaultReferenceDistanceAnchor : defaultOrigin,
        referenceDistanceHandleOffsets: [
          0.13108430697783005,
          0.065990108556575
        ],
        firstVanishingPoint: {
          lineSegments: [
            [
              {
                x: 0.4818953851492018,
                y: 0.18529755347139623
              },
              {
                x: 0.3167539902845246,
                y: 0.2606999044047578
              }
            ],
            [
              {
                x: 0.5280383992597733,
                y: 0.8574200419664915
              },
              {
                x: 0.6498458824890123,
                y: 0.6917293352712968
              }
            ]
          ]
        }
      };
      exports.defaultControlPointsState1VP = {
        horizon: [
          {
            x: 0.2,
            y: 0.5
          },
          {
            x: 0.8,
            y: 0.5
          }
        ]
      };
      exports.defaultControlPointsState2VP = {
        secondVanishingPoint: {
          lineSegments: [
            [
              {
                x: 0.34623259623259617,
                y: 0.659551470318368
              },
              {
                x: 0.49578722002635034,
                y: 0.8792706756358705
              }
            ],
            [
              {
                x: 0.5056920556920557,
                y: 0.17069050371693362
              },
              {
                x: 0.7026699426699425,
                y: 0.2689684285221547
              }
            ]
          ]
        },
        thirdVanishingPoint: {
          lineSegments: [
            [
              {
                x: 0.33624078624078624,
                y: 0.6067665545026896
              },
              {
                x: 0.30893837018837017,
                y: 0.3142575174095972
              }
            ],
            [
              {
                x: 0.6774662162162162,
                y: 0.6094667009961638
              },
              {
                x: 0.7070341932841933,
                y: 0.35057030079777063
              }
            ]
          ]
        }
      };
    }
  });

  // entry.js
  var require_entry = __commonJS({
    "entry.js"(exports, module) {
      var Solver = require_solver().default;
      var MathUtil = require_math_util().default;
      var CoordinatesUtil = require_coordinates_util().default;
      var CoordinatesModule = require_coordinates_util();
      var Transform = require_transform().default;
      var Vector3D = require_vector_3d().default;
      var cameraModule = require_camera_presets();
      var settingsTypes = require_calibration_settings();
      var calibrationDefaults = require_calibration_settings2();
      var controlPointDefaults = require_control_points_state();
      var defaultSolverResult = require_solver_result().default;
      module.exports = {
        Solver,
        MathUtil,
        CoordinatesUtil,
        ImageCoordinateFrame: CoordinatesModule.ImageCoordinateFrame,
        Transform,
        Vector3D,
        cameraPresets: cameraModule.cameraPresets,
        defaultCalibrationSettingsBase: calibrationDefaults.defaultCalibrationSettingsBase,
        defaultCalibrationSettings1VP: calibrationDefaults.defaultCalibrationSettings1VP,
        defaultCalibrationSettings2VP: calibrationDefaults.defaultCalibrationSettings2VP,
        defaultControlPointsStateBase: controlPointDefaults.defaultControlPointsStateBase,
        defaultControlPointsState1VP: controlPointDefaults.defaultControlPointsState1VP,
        defaultControlPointsState2VP: controlPointDefaults.defaultControlPointsState2VP,
        defaultSolverResult,
        Axis: settingsTypes.Axis,
        PrincipalPointMode1VP: settingsTypes.PrincipalPointMode1VP,
        PrincipalPointMode2VP: settingsTypes.PrincipalPointMode2VP,
        ReferenceDistanceUnit: settingsTypes.ReferenceDistanceUnit
      };
    }
  });
  return require_entry();
})();
