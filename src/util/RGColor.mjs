/**
 * @typedef Rgba255Color
 * @property {Number} r The red component of a color [0,255]
 * @property {Number} g The green component of a color [0,255]
 * @property {Number} b The blue component of a color [0,255]
 * @property {Number} a The alpha component of a color [0,255]
 */

/**
 * @classdesc A color value.
 */
export class RGColor{

    /**
     * @description Creates a color object that can store RGBA values. RGBA input should be in range [0,1]
     * 
     * @param {Number} r The red component of this color.
     * @param {Number} g The green component of this color.
     * @param {Number} b The blue component of this color.
     * @param {Number} a The alpha component of this color.
     */
    constructor(r,g,b,a){
        this.r = Math.max(0,Math.min(1,r));
        this.g = Math.max(0,Math.min(1,g));
        this.b = Math.max(0,Math.min(1,b));
        this.a = Math.max(0,Math.min(1,a));
    }

    /**
     * @description Returns an {@link Rgba255Color} object with values mapping to the range [0,255]
     * @returns {Rgba255Color}
     */
    getRgba255 = function(){
        return {
            r: this.r * 255,
            g: this.g * 255,
            b: this.b * 255,
            a: this.a * 255
        }
    }

    /**
     * @description Multiplies two RGColors together and returns the product
     * 
     * @param {RGColor} c1 
     * @param {RGColor} c2 
     * @returns {RGColor}
     */
    static multiply = function(c1,c2){
        return new RGColor(
            c1.r * c2.r,
            c1.g * c2.g,
            c1.b * c2.b,
            c1.a * c2.a
        )
    }
}