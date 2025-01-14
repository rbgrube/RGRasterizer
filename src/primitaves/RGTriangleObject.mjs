import { RGColor } from "../util/RGColor.mjs";
import { RGQuaternion } from "../util/RGQuaternion.mjs";
import { RGVec3 } from "../util/RGVec3.mjs";
import { RGPlane } from "./RGPlane.mjs";
import { RGTriangleRenderer } from "./RGTriangleRenderer.mjs";

export class RGTriangleObject{

    constructor(verts){
        if(verts.length != 3){
            console.error("RGTriangleObject must contain exactly 3 verticies");
        }
    
        this.verts = verts;
        this.pos = new RGVec3(0,0,0)
        this.scale = 1;

        this.color = new RGColor(Math.random(),Math.random(),Math.random(),1);

        this.rotation = new RGQuaternion(0,0,0,0);
        this.rotationCenter = new RGVec3(0,0,0);

        this.textureCoords = [];
    }

    rotateAround = function(p,angle,axis){
        this.rotation = RGQuaternion.fromAngleAxis(angle,axis);
        this.rotationCenter = p;
    }

    getVerts = function(){
        let transformedVerts = [];
        this.verts.forEach(v => {
            let rotatedV = this.rotation.rotate3dPoint(v.minus(this.rotationCenter)).plus(this.rotationCenter);
            let transformedV = rotatedV.plus(this.pos);
            transformedV = transformedV.minus(this.pos).multiplyScalar(this.scale).plus(this.pos);
            transformedVerts.push(transformedV);
        })
        return transformedVerts;
    }

    worldFromBarycentric = function(barycentric){
        let rotatedVerts = this.getVerts();
        //See RGScreenTriangle
        return new RGVec3(
            barycentric.x * rotatedVerts[0].x + barycentric.y * rotatedVerts[1].x + barycentric.z * rotatedVerts[2].x,
            barycentric.x * rotatedVerts[0].y + barycentric.y * rotatedVerts[1].y + barycentric.z * rotatedVerts[2].y,
            barycentric.x * rotatedVerts[0].z + barycentric.y * rotatedVerts[1].z + barycentric.z * rotatedVerts[2].z
        )
    }

    clip = function(planes){
        let trisToClip = [this];

        planes.forEach(p => {
            let clippedTris = [];
            trisToClip.forEach(t => {
                let verts = t.getVerts();
                // check which side of plane each vert is on
                let sideV0 = Math.sign(RGVec3.dot(verts[0].minus(p.point), p.normal))
                let sideV1 = Math.sign(RGVec3.dot(verts[1].minus(p.point), p.normal))
                let sideV2 = Math.sign(RGVec3.dot(verts[2].minus(p.point), p.normal))
                
                if(sideV0 == sideV1 == sideV2){
                    //all are on same side
                    if(sideV0 > 0){
                        //draw
                        clippedTris.push(t)
                    }
                    //reject
                }
            })
            trisToClip = clippedTris;
        })
        return trisToClip;
    }

    render = function(cam,rctx,useMat){

        //TODO back face culling
        let clippingPlanes = cam.getClippingPlanes();

        this.clip([
            clippingPlanes.near,
            clippingPlanes.left,
            clippingPlanes.right,
            clippingPlanes.top,
            clippingPlanes.bottom
        ]).forEach(t=>{
            if(RGVec3.dot(clippingPlanes.near.normal, RGPlane.fromPoints(t.getVerts()).normal) >= 0){
                RGTriangleRenderer.render(t,cam,rctx,useMat)
            }
        })
    }
}