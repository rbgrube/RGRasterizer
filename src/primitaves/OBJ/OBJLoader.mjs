import { RGColor } from "../../util/RGColor.mjs";
import { RGQuaternion } from "../../util/RGQuaternion.mjs";
import { RGVec3 } from "../../util/RGVec3.mjs";
import { RGTriangleObject } from "../RGTriangleObject.mjs";
import { RGTriangleRenderer } from "../RGTriangleRenderer.mjs";
import { RGObject } from "./RGObject.mjs";

export class ObjLoader{
    constructor(filename, onload = () => {}){

        this.filename = filename;
        this.onload = onload;

        this.readLine = 0;
        this.lines = [];

        (async () => {
            await fetch(this.filename).then(res => res.text()).then(data => {
                this.lines = data.split(/\r?\n/);
                this.loadInvObjects();
                this.onload();
            })
        })()

        // ADD INDIVIUAL OBJECTS
        // {objName: ,objLines[]: , material }
        this.individualObjects = [];

        this.tris = [];

        this.pos = new RGVec3(0,0,0);

        this.scale = 1;

        this.rotation = new RGQuaternion.fromAngleAxis(0,new RGVec3(1,0,0));
        this.rotationCenter = new RGVec3(0,0,0);

    }
    
    getObjects = function(){
        return this.individualObjects;
    }

    //seperates file into INDV objects and materials
    loadInvObjects = function(){

        let newObjLineIndicies = [];

        this.lines.forEach((l,i) => {
            let params = l.split(' ');
            //new object
            if(params[0] == "o"){
                newObjLineIndicies.push(i);
            }
        })

        if(newObjLineIndicies.length == 0){
            this.individualObjects.push(
                ObjLoader.generateRGObjectFromLines(this.lines)
            )
            return
        }
        newObjLineIndicies.forEach((lineIndex, objectIndex) => {
            if(newObjLineIndicies[objectIndex + 1]){
                this.individualObjects.push(
                    ObjLoader.generateRGObjectFromLines(this.lines.slice(lineIndex,newObjLineIndicies[objectIndex + 1]))
                )
            }else{
                this.individualObjects.push(
                    ObjLoader.generateRGObjectFromLines(this.lines.slice(lineIndex))
                )
            }
        })
    }

    static generateRGObjectFromLines = function(lines){

        let name = '';
        let mat = '';
        let verts = RGObject.getVerts(lines);
        let faces = RGObject.getFaces(lines);
        let textureCoords = RGObject.getTextureCoords(lines);

        lines.forEach((l,i) => {
            let params = l.split(' ');
            //new object
            if(params[0] == "o"){
                name = params[1];
            }
            if(params[0] == "usemtl"){
                mat = params[1];
            }
        })

        return new RGObject(name,verts,faces,textureCoords,mat)
    }

}
