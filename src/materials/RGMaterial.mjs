import { RGColor } from "../util/RGColor.mjs";
import { RGTextureImage } from "./RGTextureImage.mjs";

/**
 * @typedef RGMaterialTextureMaps
 * @property {TextureImage} Ka
 */

export class RGMaterial{

    /**
     * 
     * @param {String} name 
     * @param {{Ka: RGColor, Kd: RGColor, Ks: RGColor, map_Ka: RGTextureImage, map_Kd: RGTextureImage, map_Ks: RGTextureImage, Ns: Number, d: Number, illum: Number }} values 
     */
    constructor(name = "", values = {}){

        this.name = name;

        this.Ka = values.Ka || new RGColor() // ambient color
        this.Kd = values.Kd || new RGColor() // diffuse color
        this.Ks = values.Ks || new RGColor() // specular color

        this.map_Ka = values.map_Ka // ambient map
        this.map_Kd = values.map_Kd // diffuse map
        this.map_Ks = values.map_Ks // specular map

        this.Ns = values.Ns // specular exponent (wieght) 0-1000

        //some material files may use "Tr" for disolve instead of "d", Tr is inverted (Tr = 1-d)
        this.d = values.d // dissolve 0 = fully transparent, 1 = fully opaque

        //TODO: Add transmission filter

        this.illum = values.illum // illumination model

        /*
        0. Color on and Ambient off
        1. Color on and Ambient on
        2. Highlight on
        3. Reflection on and Ray trace on
        4. Transparency: Glass on, Reflection: Ray trace on
        5. Reflection: Fresnel on and Ray trace on
        6. Transparency: Refraction on, Reflection: Fresnel off and Ray trace on
        7. Transparency: Refraction on, Reflection: Fresnel on and Ray trace on
        8. Reflection on and Ray trace off
        9. Transparency: Glass on, Reflection: Ray trace off
        10. Casts shadows onto invisible surfaces
        */

    }

    /**
     * Returns the color value of this material at a specific uv, 0-1
     * 
     * @param {Number} u 0-1
     * @param {Number} v 0-1
     */
    getColorUV = function(u,v){
        //if this texture has a diffuse map
        if(this.map_Kd){
            return this.map_Kd.getColorFromUV(u,v);
        }else{
            //just return diffuse color
            return this.Kd;
        }

    }
}