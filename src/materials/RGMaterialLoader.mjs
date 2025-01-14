import { RGColor } from "../util/RGColor.mjs";
import { RGMaterial } from "./RGMaterial.mjs";
import { RGTextureImage } from "./RGTextureImage.mjs";

export class RGMaterialLoader {

    constructor(filename, fileSearchDirectory, onload = () => { }) {

        //this.matName = '';

        this.filename = filename;
        this.fileSearchDirectory = fileSearchDirectory;
        this.onload = onload;

        this.readLine = 0;
        this.lines = [];

        this.matLoaded = 0;
        this.materials = [];

        (async () => {
            await fetch(this.filename)
                .then(res => res.text())
                .then(data => {
                    this.lines = data.split(/\r?\n/);
                    this.splitLines();
                })
        })()

        /*
        this.maps = {
            diffuse: undefined,
        }
            */

    }

    getMaterials = function(){
        return this.materials;
    }

    splitLines = function () {
        let newMtlLineIndicies = [];

        this.lines.forEach((l, i) => {
            let params = l.split(' ');
            //new object
            if (params[0] == "newmtl") {
                newMtlLineIndicies.push(i);
            }
        })

        if (newMtlLineIndicies.length == 0) {
            this.materials.push(
                this.generateMatFromLines(this.lines)
            )
            return
        }
        newMtlLineIndicies.forEach((lineIndex, mtlIndex) => {
            if (newMtlLineIndicies[mtlIndex + 1]) {
                this.materials.push(
                    this.generateMatFromLines(this.lines.slice(lineIndex, newMtlLineIndicies[mtlIndex + 1]))
                )
            } else {
                this.materials.push(
                    this.generateMatFromLines(this.lines.slice(lineIndex))
                )
            }
        })
    }
    generateMatFromLines = function (lines) {

        let mat = new RGMaterial();

        lines.forEach(l => {
            let params = l.split(/\s+/g).filter(e => String(e).trim());
        
            switch (params[0]) {
                case 'newmtl':
                    mat.name = params[1];
                    break;
                case 'Ka':
                case 'Kd':
                case 'Ks':
                    mat[params[0]] = new RGColor(params[1], params[2], params[3])
                    break;
                case 'map_Ka':
                case 'map_Kd':
                case 'map_Ks':
                    mat.texToLoad ++;
                    RGTextureImage.fromURL(this.fileSearchDirectory + params[1]).then(tex => {mat[params[0]] = tex; mat.texLoaded ++; mat.checkLoaded((()=>{
                        this.matLoaded ++; 
                        if(this.matLoaded == this.materials.length){
                            this.onload()
                        }
                    }));});
                    break;
                case 'Ns':
                case 'd':
                case 'illum':
                    mat[params[0]] = params[1]
                    break;
            }

        })

        return mat;

    }


}