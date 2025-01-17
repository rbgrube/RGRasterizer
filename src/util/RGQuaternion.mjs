import { RGVec3 } from "./RGVec3.mjs";
/**
 * @classdesc A quaternion, represented by one real part and a 3 imaginary parts. Used primarly for representing 3d rotation. Always normalized.
 */
export class RGQuaternion{

    /**
     * @description Creates a new quaternion using raw components, To create one using an angle and axis, use the {@link RGQuaternion#fromAngleAxis} method.
     * 
     * @param {Number} w Real component
     * @param {Number} i The first imanginary component
     * @param {Number} j The second imanginary component
     * @param {Number} k The third imanginary component
     */
    constructor(w,i,j,k){
        this.w = w;
        this.i = i;
        this.j = j;
        this.k = k;
        this.normalize()
    }

    /**
     * @description Creates a new quaternion using an angle of rotation around an 3 dimensional axis
     * 
     * @param {Number} angle The angle of rotation
     * @param {RGVec3} axis The axis of rotation
     * @returns {RGQuaternion} A quaternion representing the roataion provided by the angle and axis
     */
    static fromAngleAxis = function(angle, axis){
        axis = axis.normalized();
        return new RGQuaternion(
            Math.cos(angle/2),
            Math.sin(angle/2) * axis.x,
            Math.sin(angle/2) * axis.y,
            Math.sin(angle/2) * axis.z,
        )
    }

    /**
     * @description Returns the quaternion resulting from the multiplication of quaternions: q1 * q2.
     * This is the composition of the two quaternions, meaning the application of q1, and then the application of q2,
     * combining their rotation to form one new quaternion
     * 
     * @param {Number} angle The angle of rotation
     * @param {RGVec3} axis The axis of rotation
     * @returns {RGQuaternion} A quaternion representing the combined rotation of q1, and then q2
     */
    static getMultiplication = function(q1, q2){
        return new RGQuaternion(
            (q1.w * q2.w) -  (q1.i * q2.i) -  (q1.j * q2.j) -  (q1.k * q2.k),
            (q1.w * q2.i) +  (q1.i * q2.w) -  (q1.j * q2.k) +  (q1.k * q2.j),
            (q1.w * q2.j) +  (q1.i * q2.k) +  (q1.j * q2.w) -  (q1.k * q2.i),
            (q1.w * q2.k) -  (q1.i * q2.j) +  (q1.j * q2.i) +  (q1.k * q2.w),
        )
    }

    /**
     * @description Returns the inverse of this quaternion, which is also the inverse of the rotation represented by this quaternion.
     * @returns {RGQuaternion} the inverse of this quaternion
     */
    inverse = function(){
        return new RGQuaternion(this.w,-this.i,-this.j,-this.k);
    }

    /**
     * @description Returns the magnitude of this quaternion
     * @returns {Number}
     */
    magnitude = function(){
        return Math.sqrt((this.w*this.w)+(this.i*this.i)+(this.j*this.j)+(this.k*this.k))
    }

    /**
     * @description Normalizes this quaternion to be a unit quaternion. Normalization is reqiured for all operations involving 
     * rotation using qauternions, and for that reason, {@link RGQuaternion#normalize} is applied on construction of all qauterions.
     */
    normalize = function(){
        let d = this.magnitude();
        this.w /= d
        this.i /= d
        this.j /= d
        this.k /= d
    }

    /**
     * @description Rotates a 3d point with the rotation described by this quaternion, relative to (0,0,0)
     * @param {RGVec3} p 
     * @returns {RGVec3} The rotated point.
     */
    rotate3dPoint = function(p){

        //Create a quaternion where the imaginary components are the components of our point
        let pointQuaternion = new RGQuaternion(0,p.x,p.y,p.z);

        //The formula for rotationg a 3d point by a qiaternion is as follows: q^-1 * p * q
        //This is an active rotation

        // q^-1 * p
        let ab = RGQuaternion.getMultiplication(this.inverse(),pointQuaternion)

        // (q^-1 * p) * q
        let finalQuaternion = RGQuaternion.getMultiplication(ab,this);

        //Finally, convert back into 3d vector
        return new RGVec3(
            finalQuaternion.i,
            finalQuaternion.j,
            finalQuaternion.k
        )
    }

}