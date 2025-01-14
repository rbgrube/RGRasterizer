import { RGCamera } from "../management/RGCamera.mjs";
import { RGContext } from "../management/RGContext.mjs";
import { RGVec2 } from "./RGVec2.mjs"
import { RGVec3 } from "./RGVec3.mjs";

/**
 * @description Projects a 3d point onto the viewing plane of a camera, returning a 2d point on said plane.
 * 
 * @param {RGVec3} point A 3d point to project
 * @param {RGCamera} camera A camera object
 * @returns {RGVec2} A 2d point on the viewing plane of the camera
 */
export function projectToCamViewport(point, camera){

    //get the point relative to the cameras position for rotation center, and also to move world rather than camera.
    let translatedPoint = point.minus(camera.getPos());

    // rotate the point with the inverse of the cameras rotation, passive rotation (world rotates rather than camera)
    /// passive rotation due to using the inverse, as rotate3dPoint() carries out active roation
    let p = camera.rot.inverse().rotate3dPoint(translatedPoint)

    let f = camera.getSettings().focalLength;

    //equations for 2d projection, as seen in notes.
    return new RGVec2(
        (p.x * f) / p.z,
        (p.y * f) / p.z
    )
}

/**
 * @description Transforms points on the camera viewing plane to points to be drawn on the screen
 * 
 * @param {RGVec2} point A 2d point on the camera viewing plane
 * @param {RGCamera} camera A camera object
 * @param {RGContext} context A drawing context
 * @returns {RGVec2} A point on the drawing context
 */
export function viewportToContext(point, camera, context){
    return new RGVec2(
        //percent of viewport dimensions * context render dimensions
        ((point.x + 1) / camera.getSettings().viewportWidth) * context.getRenderWidth(),
        (((point.y * -1) + 1) / camera.getSettings().viewportHeight) * context.getRenderHeight()
    )
}