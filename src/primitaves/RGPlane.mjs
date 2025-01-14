import { RGVec3 } from "../util/RGVec3.mjs";

//NORMAL DIRECTION VERTS COUNTERCLOCKWISE

export class RGPlane{
    constructor(point, normal){
        this.point = point;
        this.normal = normal;
    }
    static fromPoints(points){
        let ab = points[0].minus(points[1]);
        let bc = points[0].minus(points[2]);

        //bc, ab for CCW - ab, bc for CW
        let normal = RGVec3.cross(bc,ab).normalized();

        return new RGPlane(points[0],normal)
    }
}