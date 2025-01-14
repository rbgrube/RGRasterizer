/**
 * @classdesc A 3 dimensional vector which can represent a point, or direction and magnitude
 */
export class RGVec3 {

    /**
     * @description Creates a 3 dimensional vector.
     * 
     * @param {Number} x the x componenet of the vector
     * @param {Number} y the y componenet of the vector
     * @param {Number} z the z componenet of the vector
     * @returns {RGVec3}
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @description returns the dot product v1 • v2, 
     * 
     * @param {RGVec3} v1 the first vector
     * @param {RGVec3} v2 the second vector
     * @returns {Number} a scalar representing how similar in direction two vectors are, ranging from -1 to 1 
     */
    static dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    /**
     * @description returns the cross product v1 x v2, 
     * 
     * @param {RGVec3} v1 the first vector
     * @param {RGVec3} v2 
     * @returns {RGVec3} a new vector which is perpendicular to both v1 and v2
     */
    static cross = function (v1, v2) {
        return new RGVec3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x,
        )
    }

    /**
     * @description subtracts v from this vector, and returns the result
     * 
     * @param {RGVec3} v the subtrahend vector
     * @returns {RGVec3} the vector result of the sutraction
     */
    minus = function (v) {
        return new RGVec3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        )
    }
    /**
     * @description adds v to this vector, and returns the result
     * 
     * @param {RGVec3} v the addend vector
     * @returns {RGVec3} the vector result of the addition
     */
    plus = function (v) {
        return new RGVec3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        )
    }
    /**
     * @description returns a new vector which is this vector scaled by a factor of a
     * @param {Number} a the scalar to multiply by
     * @returns {RGVec3} 
     */
    multiplyScalar = function (a) {
        return new RGVec3(
            this.x * a,
            this.y * a,
            this.z * a
        )
    }

    /**
     * @description gives the absolute distance between the point at the tip of this vector, and the point at the tip of vector v
     * 
     * @param {RGVec3} v a vector to take the distance to
     * @returns {Number}
     */
    distanceTo = function (v) {
        return Math.abs(Math.sqrt(
            (v.x - this.x) * (v.x - this.x) +
            (v.y - this.y) * (v.y - this.y) +
            (v.z - this.z) * (v.z - this.z)
        ))
    }

    /**
     * @description returns the magnitude of this vector (this distance from (0,0,0) to the point at this vector's tip)
     * @returns {Number}
     */
    magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    /**
     * @description returns a unit vector where all components are in the range [0,1] (magnitude = 1)
     * @returns {RGVec3} a unit vector
     */
    normalized = function () {
        return new RGVec3(
            this.x / this.magnitude(),
            this.y / this.magnitude(),
            this.z / this.magnitude()
        )
    }
}