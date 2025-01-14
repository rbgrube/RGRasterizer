import { RGColor } from "../../util/RGColor.mjs";
import { RGQuaternion } from "../../util/RGQuaternion.mjs";
import { RGVec2 } from "../../util/RGVec2.mjs";
import { RGVec3 } from "../../util/RGVec3.mjs";
import { RGTriangleObject } from "../RGTriangleObject.mjs";

export class RGObject{
    constructor(name, verts, faces, textureCoords, matName){
        this.name = name;
        this.verts = verts;
        this.faces = faces;
        this.matName = matName;
        this.textureCoords = textureCoords;
        
        this.tris = [];

        this.pos = new RGVec3(0,0,0);
        this.scale = 1;

        this.rotation = new RGQuaternion.fromAngleAxis(0,new RGVec3(1,0,0));
        this.rotationCenter = new RGVec3(0,0,0);
    }

    rotateAround = function(p,angle,axis){
        this.rotation = RGQuaternion.fromAngleAxis(angle,axis);
        this.rotationCenter = p;
    }
    setPos = function(p){
        this.pos = p;
    }
    scaleTo = function(x){
        this.scale = x;
    }

    

    static getVerts = function(lines){
        let verts = [];

        lines.forEach(l => {
            let params = l.split(" ");
            if(params[0] == "v"){
                //vert
                verts.push(new RGVec3(params[1], params[2], params[3]))
            }
        });

        return verts;
    }
    static getFaces = function(lines){
        let faces = [];

        lines.forEach(l => {
            let params = l.split(" ");
            if(params[0] == "f"){
                //face
                let thisFace = [];
                for(let p=1; p < params.length; p++){
                    thisFace.push({vertex:params[p].split("/")[0], texture:params[p].split("/")[1]})
                }
                faces.push(thisFace);
            }
        });

        return faces;
    }
    static getTextureCoords = function(lines){
        let coords = [];

        lines.forEach(l => {
            let params = l.split(" ");
            if(params[0] == "vt"){
                //vert
                coords.push(new RGVec2(params[1], params[2], params[3]))
            }
        });

        return coords;
    }

    triangulate = () => {

        if(this.tris.length != 0){
            return this.tris;
        }

        //INDEX AT 1 FOR FACE REFRENCES TO VERTICIES

        for(let f = 0; f < this.faces.length; f++){
            let col = new RGColor(Math.random(),Math.random(),Math.random(), 1)
            //if(faces[f].length == 3){
                //already triangle
                let generatedTri = new RGTriangleObject([
                    this.verts[ this.faces[f][0].vertex - 1],
                    this.verts[ this.faces[f][1].vertex - 1],
                    this.verts[ this.faces[f][2].vertex - 1]
                ])
                generatedTri.textureCoords = [
                    this.textureCoords[ this.faces[f][0].texture - 1],
                    this.textureCoords[ this.faces[f][1].texture - 1],
                    this.textureCoords[ this.faces[f][2].texture - 1]
                ] 
                generatedTri.color = col;
                this.tris.push(generatedTri)
            //}
        }

        return this.tris;
    }

    render = function(cam,rctx,materials){
        this.triangulate().forEach(t => {
            t.rotation = this.rotation;
            t.rotationCenter = this.rotationCenter;
            t.pos = this.pos;
            t.scale = this.scale;

            let useMat;
            materials.forEach(m => {
                if(m.name == this.matName){
                    useMat = m;
                }
            })

            t.render(cam,rctx,useMat)
        })
    }
}