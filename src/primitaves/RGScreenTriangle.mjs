import { orient2dPoints } from "../util/Orient2dPoints.mjs";
import { RGVec2 } from "../util/RGVec2.mjs";
import { RGVec3 } from "../util/RGVec3.mjs";

export class RGScreenTriangle{

    constructor(verts,textureCoords){
        if(verts.length != 3){
            console.error("RGScreenTriangle must contain exactly 3 verticies");
        }
        this.verts = verts;
        this.textureCoords = textureCoords;
    }

    area = function(){

        let v = this.getVerts();

        return Math.abs((
            v[0].x * (v[1].y - v[2].y) +
            v[1].x * (v[2].y - v[0].y) +
            v[2].x * (v[0].y - v[1].y) 
        ) / 2);
        
    }

    get2dBoundingBox = function(){
        return {
            lower : {
                x: Math.floor(Math.min(this.verts[0].x,this.verts[1].x,this.verts[2].x)),
                y: Math.floor(Math.min(this.verts[0].y,this.verts[1].y,this.verts[2].y))
            },
            upper : {
                x: Math.ceil(Math.max(this.verts[0].x,this.verts[1].x,this.verts[2].x)),
                y: Math.ceil(Math.max(this.verts[0].y,this.verts[1].y,this.verts[2].y))
            },
            clip: function(minX,minY,maxX,maxY){
                this.lower.x = Math.max(minX, this.lower.x)
                this.lower.y = Math.max(minY, this.lower.y)
                this.upper.x = Math.min(maxX, this.upper.x)
                this.upper.y = Math.min(maxY, this.upper.y)
            },
            width: function(){
                return this.upper.x - this.lower.x;
            },
            height: function(){
                return this.upper.y - this.lower.y;
            }
        }
    }

    getVerts = function(){
        return this.verts;
    }

    contains = function(p){
        let turns = 0;

        turns += orient2dPoints(this.verts[0],this.verts[1],p)
        turns += orient2dPoints(this.verts[1],this.verts[2],p)
        turns += orient2dPoints(this.verts[2],this.verts[0],p)

        if(Math.abs(turns) == 3){
            return true;
        }
        return false;
    }

    getBarycentric = function(p){

        let weightV2 = new RGScreenTriangle([p, this.verts[0], this.verts[1]]).area() / this.area();
        let weightV0 = new RGScreenTriangle([p, this.verts[1], this.verts[2]]).area() / this.area();
        let weightV1 = new RGScreenTriangle([p, this.verts[0], this.verts[2]]).area() / this.area();


        return new RGVec3(
             weightV0,
             weightV1,
             weightV2
        )
    }

    getUV(bc){
        return new RGVec2(
            bc.x * this.textureCoords[0].x + bc.y * this.textureCoords[1].x + bc.z * this.textureCoords[2].x,
            bc.x * this.textureCoords[0].y + bc.y * this.textureCoords[1].y + bc.z * this.textureCoords[2].y,
        )
    }
}