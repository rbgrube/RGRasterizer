/**
 * @classdesc A 2 dimensional vector which can represent a point, or direction and magnitude
 */
export class RGVec2 {
    /**
     * @description Creates a 2 dimensional vector
     * @param {Number} x the x component of the vector
     * @param {Number} y the y component of the vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @description returns the dot product v1 • v2, 
     * @param {RGVec2} v1 
     * @param {RGVec2} v2 
     * @returns {Number} a scalar representing how similar in direction two vectors are, ranging from -1 to 1 
     */
    static dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    /**
     * @description returns the cross product v1 x v2, 
     * @param {RGVec2} v1 
     * @param {RGVec2} v2 
     * @returns {Number} a scalar representing the signed area of the paralellogram between the two vectors. 
     * The area is negative if v1 is rotated clockwise to v2, and positive if v1 is rotated counterclockwise to v2
     */
    static cross = function (v1, v2) {
        //only part of cross product def
        return v1.x * v2.y - v1.y * v2.x;
    }

    /**
     * @description subtracts v from this vector, and returns the result
     * 
     * @param {RGVec2} v the subtrahend vector
     * @returns {RGVec2} the vector result of the sutraction
     */
    minus = function (v) {
        return new RGVec2(
            this.x - v.x,
            this.y - v.y,
        )
    }
    /**
     * @description adds v to this vector, and returns the result
     * 
     * @param {RGVec2} v the addend vector
     * @returns {RGVec2} the vector result of the addition
     */
    plus = function (v) {
        return new RGVec2(
            this.x - v.x,
            this.y - v.y,
        )
    }
    /**
     * @description returns a new vector which is this vector scaled by a factor of a
     * @param {Number} a the scalar to multiply by
     * @returns {RGVec2} 
     */
    multiplyScalar = function (x) {
        return new RGVec2(
            this.x * x,
            this.y * x,
        )
    }
}