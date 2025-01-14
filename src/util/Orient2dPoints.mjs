import { RGVec2 } from "./RGVec2.mjs";

/**
 * @description Returns 1 if the turn formed from a to b to c is a right turn or a straight line, and  -1 if it is a left turn.
 * 
 * This is useful for checking if a point is inside of a triangle, because if the turns from each edge of a trinagle to the point are
 * all of the same direction, the point is inside of the trinagle.
 * 
 * @param {RGVec2} a The first point.
 * @param {RGVec2} b The second point.
 * @param {RGVec2} c The third point.
 * @returns {Number} 
 */
export function orient2dPoints(a,b,c){

    //edge ab
    let ab = new RGVec2(b.x-a.x,b.y-a.y);
    //edge ac
    let ac = new RGVec2(c.x-a.x,c.y-a.y);

    //if the signed area of the parallelagram sweeping from ab to ac is positive, its is a right turn. If its negative, its a left turn
    return Math.sign(RGVec2.cross(ab,ac))
}