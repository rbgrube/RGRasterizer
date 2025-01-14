import { RGScreenTriangle } from "./RGScreenTriangle.mjs"
import { projectToCamViewport, viewportToContext } from "../util/PerspectiveProjection.mjs";
import { RGVec2 } from "../util/RGVec2.mjs";
import { RGTriangleObject } from "./RGTriangleObject.mjs";
import { RGCamera } from "../management/RGCamera.mjs";
import { RGContext } from "../management/RGContext.mjs";

/**
 * @classdesc A class containing methods related to drawing triangles.
 */
export class RGTriangleRenderer {

    /**
     * 
     * @param {RGTriangleObject} tri 
     * @param {RGCamera} cam 
     * @param {RGContext} rgContext 
     * @param {RGM} useMat 
     */
    static render = function (tri, cam, rgContext, useMat) {
        let screenVerticies = [];
        let texCoords = [];

        tri.getVerts().forEach((v,i) => {
            let viewportPoint = projectToCamViewport(v, cam)
            let contextPoint = viewportToContext(viewportPoint, cam, rgContext)
            screenVerticies.push(contextPoint);
            texCoords.push(tri.textureCoords[i])
        })

        let contextTriangle = new RGScreenTriangle(screenVerticies,texCoords);
        let maxRenderingBounds = contextTriangle.get2dBoundingBox();
        maxRenderingBounds.clip(0,0,rgContext.getRenderWidth(),rgContext.getRenderHeight())

        for(let y = maxRenderingBounds.lower.y; y < maxRenderingBounds.upper.y; y++){
            for(let x = maxRenderingBounds.lower.x; x < maxRenderingBounds.upper.x; x++){
                if (contextTriangle.contains(new RGVec2(x, y))) {   


                    let bc = contextTriangle.getBarycentric(new RGVec2(x,y)) //barycentric coords of this pixel on screenTri
    
                    let worldCoords = tri.worldFromBarycentric(bc); //coords for this pixel on this triangle in the world
                    
                    if (1/cam.pos.distanceTo(worldCoords) > rgContext.getZBuffer(x,y)) { //1/z so z-buffer cvan start at 0
    
                        rgContext.setZBuffer(x,y,1/cam.pos.distanceTo(worldCoords));
    
                        if(useMat){
                            let uv = contextTriangle.getUV(bc);
                            rgContext.setFrameBuffer(x,y,useMat.getColorUV(uv.x,uv.y))
                        }
                        else{
                            rgContext.setFrameBuffer(x,y,tri.color)
                        }
                        
                    }
                }
            }
        }

    }

}