import { RGColor } from "../util/RGColor.mjs";

export class RGTextureImage{
    constructor(imageData, width, height){
        this.imageData = imageData;
        this.width = width;
        this.height = height;
    }

    static fromURL = async function(url){
        return new Promise((resolve, reject) => {

            let img = new Image();
            img.crossOrigin = 'Anonymous'
    
            img.onload = () => {
                let tempCanv = document.createElement('canvas');
                tempCanv.width = img.width;
                tempCanv.height = img.height;
                let tmpCtx = tempCanv.getContext('2d');
                tmpCtx.drawImage(img,0,0);
                
                resolve(new RGTextureImage(
                    tmpCtx.getImageData(0,0,img.width,img.height),
                    img.width,
                    img.height
                ))
            }
            img.onerror = (e) => {
                reject(e);
            }
            img.src = url;

        })
    }

    getColorFromPixel = function(x,y){

        let col = new RGColor(
            this.imageData.data[(y * this.width + x) * 4] / 255,
            this.imageData.data[(y * this.width + x) * 4 + 1] / 255,
            this.imageData.data[(y * this.width + x) * 4 + 2] / 255,
            this.imageData.data[(y * this.width + x) * 4 + 3] / 255
        )
        return col;
    }

    getColorFromUV = function(u,v){
        let pixelX = Math.floor((u % 1) * this.width);
        let pixelY = Math.floor((v % 1) * this.height);

        return this.getColorFromPixel(pixelX,pixelY);
    }
}