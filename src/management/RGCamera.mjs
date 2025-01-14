import { RGPlane } from "../primitaves/RGPlane.mjs";
import { RGQuaternion } from "../util/RGQuaternion.mjs";
import { RGVec3 } from "../util/RGVec3.mjs";
import { Vec3 } from "../webpack_entry.mjs";

export class RGCamera{

    constructor(pos,settings = null){
        this.pos = pos;

        this.rot = RGQuaternion.fromAngleAxis(0,new RGVec3(0,0,1));
        this.rotCenter = this.pos;

        this.settings = {
            focalLength: 1,
            viewportWidth: 2,
            viewportHeight: 2
        }
    }
    getPos = function(){
        return this.pos;
    }
    rotateAroundSelf = function(angle, axis){
        this.rot = RGQuaternion.getMultiplication(this.rot, new RGQuaternion.fromAngleAxis(angle,axis));
        this.rotCenter = this.pos;
    }

    moveRelative = function(moveVector){
        this.pos = this.pos.plus(this.rot.rotate3dPoint(moveVector))
    }

    getClippingPlanes(){
        return {
            near : RGPlane.fromPoints([
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(-this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            left : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(-this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(-this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            right : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            top : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(-this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            bottom : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new Vec3(-this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength)))
            ])
        }
    }

    getSettings = function(){
        return this.settings;
    }

}