var RG;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Camera: () => (/* reexport */ RGCamera),
  Color: () => (/* reexport */ RGColor),
  Context: () => (/* reexport */ RGContext),
  MaterialLoader: () => (/* reexport */ RGMaterialLoader),
  ObjLoader: () => (/* reexport */ ObjLoader),
  Scene: () => (/* reexport */ RGScene),
  SceneRenderer: () => (/* reexport */ RGSceneRenderer),
  TriangleObject: () => (/* reexport */ RGTriangleObject),
  TriangleRenderer: () => (/* reexport */ RGTriangleRenderer),
  Vec2: () => (/* reexport */ RGVec2),
  Vec3: () => (/* reexport */ RGVec3)
});

;// ./src/management/RGContext.mjs
class RGContext{

    constructor(width,height,resolution,drawingContext){

        this.clientWidth = width;
        this.clientHeight = height;

        this.resolution = resolution;
        this.drawingContext = drawingContext;

        this.FRAME_BUFFER;
        this.Z_BUFFER;

    }
    clear = function(){
        this.drawingContext.clearRect(0,0,this.clientWidth,this.clientHeight);
    }


    getRenderWidth = function(){
        return Math.floor(this.clientWidth * this.resolution) || 0
    }
    getRenderHeight = function(){
        return Math.floor(this.clientHeight * this.resolution) || 0
    }

    static createFromCanvas2d = function(context,resolution){
        let ret = new RGContext(
            context.canvas.clientWidth,
            context.canvas.clientHeight,
            resolution,
            context
        )

        ret.FRAME_BUFFER = new Uint8ClampedArray(ret.getRenderWidth() * ret.getRenderHeight() * 4).fill(0);
        ret.Z_BUFFER = new Array(ret.getRenderWidth() * ret.getRenderHeight()).fill(0);

        return ret;
    }

    getFrameBuffer = function(x,y){
        return this.FRAME_BUFFER[(y * this.getRenderWidth() + x) * 4];
    }
    setFrameBuffer = function(x, y, color){
        let w = this.getRenderWidth(); 
        let RGBA = color.getRgba255();

        this.FRAME_BUFFER[(y * w + x) * 4    ] = RGBA.r;
        this.FRAME_BUFFER[(y * w + x) * 4 + 1] = RGBA.g;
        this.FRAME_BUFFER[(y * w + x) * 4 + 2] = RGBA.b;
        this.FRAME_BUFFER[(y * w + x) * 4 + 3] = RGBA.a;
    }
    getZBuffer = function(x,y){
        return this.Z_BUFFER[y * this.getRenderWidth() + x]
    }
    setZBuffer = function(x,y, val){
        this.Z_BUFFER[y * this.getRenderWidth() + x] = val;
    }

    drawFrameBufferAndClear = function(){

        let imgData = new ImageData(this.FRAME_BUFFER,this.getRenderWidth());
        this.drawingContext.imageSmoothingEnabled = false;
        (async () => {
            let bitmap = await createImageBitmap(imgData);
            this.drawingContext.drawImage(bitmap,0,0,this.getRenderWidth(),this.getRenderHeight(),0,0,this.clientWidth,this.clientHeight)
        })()

        this.FRAME_BUFFER.fill(255)
        this.Z_BUFFER.fill(0)
    }
    
}
;// ./src/management/RGScene.mjs
class RGScene{
    constructor(){
        this.objects = [];
        this.materials = [];
    }

    useMTLs = function(materials){
        this.materials.push(...materials);
    }

    add = function(o){
        if(Array.isArray(o)){
            this.objects.push(...o)
        }else{
            this.objects.push(o)
        }
    }

    render = function(rctx,cam){
    
        this.objects.forEach(o => {
            o.render(cam,rctx,this.materials);
        });

        rctx.drawFrameBufferAndClear();
    }
}
;// ./src/management/RGSceneRenderer.mjs
class RGSceneRenderer{

    constructor(rgContext,rgCamera){
        this.rgContext = rgContext;
        this.rgCamera = rgCamera;
    }

    drawFrame = function(rgScene){
        rgScene.render(this.rgContext,this.rgCamera);
    }
}
;// ./src/util/RGVec3.mjs
/**
 * @classdesc A 3 dimensional vector which can represent a point, or direction and magnitude
 */
class RGVec3 {

    /**
     * @description Creates a 3 dimensional vector.
     * 
     * @param {Number} x the x componenet of the vector
     * @param {Number} y the y componenet of the vector
     * @param {Number} z the z componenet of the vector
     * @returns {RGVec3}
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @description returns the dot product v1 • v2, 
     * 
     * @param {RGVec3} v1 the first vector
     * @param {RGVec3} v2 the second vector
     * @returns {Number} a scalar representing how similar in direction two vectors are, ranging from -1 to 1 
     */
    static dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    /**
     * @description returns the cross product v1 x v2, 
     * 
     * @param {RGVec3} v1 the first vector
     * @param {RGVec3} v2 
     * @returns {RGVec3} a new vector which is perpendicular to both v1 and v2
     */
    static cross = function (v1, v2) {
        return new RGVec3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x,
        )
    }

    /**
     * @description subtracts v from this vector, and returns the result
     * 
     * @param {RGVec3} v the subtrahend vector
     * @returns {RGVec3} the vector result of the sutraction
     */
    minus = function (v) {
        return new RGVec3(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        )
    }
    /**
     * @description adds v to this vector, and returns the result
     * 
     * @param {RGVec3} v the addend vector
     * @returns {RGVec3} the vector result of the addition
     */
    plus = function (v) {
        return new RGVec3(
            this.x + v.x,
            this.y + v.y,
            this.z + v.z
        )
    }
    /**
     * @description returns a new vector which is this vector scaled by a factor of a
     * @param {Number} a the scalar to multiply by
     * @returns {RGVec3} 
     */
    multiplyScalar = function (a) {
        return new RGVec3(
            this.x * a,
            this.y * a,
            this.z * a
        )
    }

    /**
     * @description gives the absolute distance between the point at the tip of this vector, and the point at the tip of vector v
     * 
     * @param {RGVec3} v a vector to take the distance to
     * @returns {Number}
     */
    distanceTo = function (v) {
        return Math.abs(Math.sqrt(
            (v.x - this.x) * (v.x - this.x) +
            (v.y - this.y) * (v.y - this.y) +
            (v.z - this.z) * (v.z - this.z)
        ))
    }

    /**
     * @description returns the magnitude of this vector (this distance from (0,0,0) to the point at this vector's tip)
     * @returns {Number}
     */
    magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }
    /**
     * @description returns a unit vector where all components are in the range [0,1] (magnitude = 1)
     * @returns {RGVec3} a unit vector
     */
    normalized = function () {
        return new RGVec3(
            this.x / this.magnitude(),
            this.y / this.magnitude(),
            this.z / this.magnitude()
        )
    }
}
;// ./src/util/RGQuaternion.mjs

/**
 * @classdesc A quaternion, represented by one real part and a 3 imaginary parts. Used primarly for representing 3d rotation. Always normalized.
 */
class RGQuaternion{

    /**
     * @description Creates a new quaternion using raw components, To create one using an angle and axis, use the {@link RGQuaternion#fromAngleAxis} method.
     * 
     * @param {Number} w Real component
     * @param {Number} i The first imanginary component
     * @param {Number} j The second imanginary component
     * @param {Number} k The third imanginary component
     */
    constructor(w,i,j,k){
        this.w = w;
        this.i = i;
        this.j = j;
        this.k = k;
        this.normalize()
    }

    /**
     * @description Creates a new quaternion using an angle of rotation around an 3 dimensional axis
     * 
     * @param {Number} angle The angle of rotation
     * @param {RGVec3} axis The axis of rotation
     * @returns {RGQuaternion} A quaternion representing the roataion provided by the angle and axis
     */
    static fromAngleAxis = function(angle, axis){
        axis = axis.normalized();
        return new RGQuaternion(
            Math.cos(angle/2),
            Math.sin(angle/2) * axis.x,
            Math.sin(angle/2) * axis.y,
            Math.sin(angle/2) * axis.z,
        )
    }

    /**
     * @description Returns the quaternion resulting from the multiplication of quaternions: q1 * q2.
     * This is the composition of the two quaternions, meaning the application of q1, and then the application of q2,
     * combining their rotation to form one new quaternion
     * 
     * @param {Number} angle The angle of rotation
     * @param {RGVec3} axis The axis of rotation
     * @returns {RGQuaternion} A quaternion representing the combined rotation of q1, and then q2
     */
    static getMultiplication = function(q1, q2){
        return new RGQuaternion(
            (q1.w * q2.w) -  (q1.i * q2.i) -  (q1.j * q2.j) -  (q1.k * q2.k),
            (q1.w * q2.i) +  (q1.i * q2.w) -  (q1.j * q2.k) +  (q1.k * q2.j),
            (q1.w * q2.j) +  (q1.i * q2.k) +  (q1.j * q2.w) -  (q1.k * q2.i),
            (q1.w * q2.k) -  (q1.i * q2.j) +  (q1.j * q2.i) +  (q1.k * q2.w),
        )
    }

    /**
     * @description Returns the inverse of this quaternion, which is also the inverse of the rotation represented by this quaternion.
     * @returns {RGQuaternion} the inverse of this quaternion
     */
    inverse = function(){
        return new RGQuaternion(this.w,-this.i,-this.j,-this.k);
    }

    /**
     * @description Returns the magnitude of this quaternion
     * @returns {Number}
     */
    magnitude = function(){
        return Math.sqrt((this.w*this.w)+(this.i*this.i)+(this.j*this.j)+(this.k*this.k))
    }

    /**
     * @description Normalizes this quaternion to be a unit quaternion. Normalization is reqiured for all operations involving 
     * rotation using qauternions, and for that reason, {@link RGQuaternion#normalize} is applied on construction of all qauterions.
     */
    normalize = function(){
        let d = this.magnitude();
        this.w /= d
        this.i /= d
        this.j /= d
        this.k /= d
    }

    /**
     * @description Rotates a 3d point with the rotation described by this quaternion, relative to (0,0,0)
     * @param {RGVec3} p 
     * @returns {RGVec3} The rotated point.
     */
    rotate3dPoint = function(p){

        //Create a quaternion where the imaginary components are the components of our point
        let pointQuaternion = new RGQuaternion(0,p.x,p.y,p.z);

        //The formula for rotationg a 3d point by a qiaternion is as follows: q^-1 * p * q
        //This is an active rotation

        // q^-1 * p
        let ab = RGQuaternion.getMultiplication(this.inverse(),pointQuaternion)

        // (q^-1 * p) * q
        let finalQuaternion = RGQuaternion.getMultiplication(ab,this);

        //Finally, convert back into 3d vector
        return new RGVec3(
            finalQuaternion.i,
            finalQuaternion.j,
            finalQuaternion.k
        )
    }

}
;// ./src/util/RGColor.mjs
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
class RGColor{

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
;// ./src/util/RGVec2.mjs
/**
 * @classdesc A 2 dimensional vector which can represent a point, or direction and magnitude
 */
class RGVec2 {
    /**
     * @description Creates a 2 dimensional vector
     * @param {Number} x the x component of the vector
     * @param {Number} y the y component of the vector
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @description returns the dot product v1 • v2, 
     * @param {RGVec2} v1 
     * @param {RGVec2} v2 
     * @returns {Number} a scalar representing how similar in direction two vectors are, ranging from -1 to 1 
     */
    static dot = function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    /**
     * @description returns the cross product v1 x v2, 
     * @param {RGVec2} v1 
     * @param {RGVec2} v2 
     * @returns {Number} a scalar representing the signed area of the paralellogram between the two vectors. 
     * The area is negative if v1 is rotated clockwise to v2, and positive if v1 is rotated counterclockwise to v2
     */
    static cross = function (v1, v2) {
        //only part of cross product def
        return v1.x * v2.y - v1.y * v2.x;
    }

    /**
     * @description subtracts v from this vector, and returns the result
     * 
     * @param {RGVec2} v the subtrahend vector
     * @returns {RGVec2} the vector result of the sutraction
     */
    minus = function (v) {
        return new RGVec2(
            this.x - v.x,
            this.y - v.y,
        )
    }
    /**
     * @description adds v to this vector, and returns the result
     * 
     * @param {RGVec2} v the addend vector
     * @returns {RGVec2} the vector result of the addition
     */
    plus = function (v) {
        return new RGVec2(
            this.x - v.x,
            this.y - v.y,
        )
    }
    /**
     * @description returns a new vector which is this vector scaled by a factor of a
     * @param {Number} a the scalar to multiply by
     * @returns {RGVec2} 
     */
    multiplyScalar = function (x) {
        return new RGVec2(
            this.x * x,
            this.y * x,
        )
    }
}
;// ./src/primitaves/RGPlane.mjs


//NORMAL DIRECTION VERTS COUNTERCLOCKWISE

class RGPlane{
    constructor(point, normal){
        this.point = point;
        this.normal = normal;
    }
    static fromPoints(points){
        let ab = points[0].minus(points[1]);
        let bc = points[0].minus(points[2]);

        //bc, ab for CCW - ab, bc for CW
        let normal = RGVec3.cross(bc,ab).normalized();

        return new RGPlane(points[0],normal)
    }
}
;// ./src/util/Orient2dPoints.mjs


/**
 * @description Returns 1 if the turn formed from a to b to c is a right turn or a straight line, and  -1 if it is a left turn.
 * 
 * This is useful for checking if a point is inside of a triangle, because if the turns from each edge of a trinagle to the point are
 * all of the same direction, the point is inside of the trinagle.
 * 
 * @param {RGVec2} a The first point.
 * @param {RGVec2} b The second point.
 * @param {RGVec2} c The third point.
 * @returns {Number} 
 */
function orient2dPoints(a,b,c){

    //edge ab
    let ab = new RGVec2(b.x-a.x,b.y-a.y);
    //edge ac
    let ac = new RGVec2(c.x-a.x,c.y-a.y);

    //if the signed area of the parallelagram sweeping from ab to ac is positive, its is a right turn. If its negative, its a left turn
    return Math.sign(RGVec2.cross(ab,ac))
}
;// ./src/primitaves/RGScreenTriangle.mjs




class RGScreenTriangle{

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
;// ./src/util/PerspectiveProjection.mjs





/**
 * @description Projects a 3d point onto the viewing plane of a camera, returning a 2d point on said plane.
 * 
 * @param {RGVec3} point A 3d point to project
 * @param {RGCamera} camera A camera object
 * @returns {RGVec2} A 2d point on the viewing plane of the camera
 */
function projectToCamViewport(point, camera){

    //get the point relative to the cameras position for rotation center, and also to move world rather than camera.
    let translatedPoint = point.minus(camera.getPos());

    // rotate the point with the inverse of the cameras rotation, passive rotation (world rotates rather than camera)
    /// passive rotation due to using the inverse, as rotate3dPoint() carries out active roation
    let p = camera.rot.inverse().rotate3dPoint(translatedPoint)

    let f = camera.getSettings().focalLength;

    //equations for 2d projection, as seen in notes.
    return new RGVec2(
        (p.x * f) / p.z,
        (p.y * f) / p.z
    )
}

/**
 * @description Transforms points on the camera viewing plane to points to be drawn on the screen
 * 
 * @param {RGVec2} point A 2d point on the camera viewing plane
 * @param {RGCamera} camera A camera object
 * @param {RGContext} context A drawing context
 * @returns {RGVec2} A point on the drawing context
 */
function viewportToContext(point, camera, context){
    return new RGVec2(
        //percent of viewport dimensions * context render dimensions
        ((point.x + 1) / camera.getSettings().viewportWidth) * context.getRenderWidth(),
        (((point.y * -1) + 1) / camera.getSettings().viewportHeight) * context.getRenderHeight()
    )
}
;// ./src/primitaves/RGTriangleRenderer.mjs







/**
 * @classdesc A class containing methods related to drawing triangles.
 */
class RGTriangleRenderer {

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
;// ./src/primitaves/RGTriangleObject.mjs






class RGTriangleObject{

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
;// ./src/primitaves/OBJ/RGObject.mjs






class RGObject{
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
            let params = l.split(/\s+/g).filter(e => String(e).trim());;
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
            let params = l.split(/\s+/g).filter(e => String(e).trim());;
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
            let params = l.split(/\s+/g).filter(e => String(e).trim());;
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
;// ./src/primitaves/OBJ/OBJLoader.mjs







class ObjLoader{
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

;// ./src/materials/RGMaterial.mjs



/**
 * @typedef RGMaterialTextureMaps
 * @property {TextureImage} Ka
 */

class RGMaterial{

    /**
     * 
     * @param {String} name 
     * @param {{Ka: RGColor, Kd: RGColor, Ks: RGColor, map_Ka: RGTextureImage, map_Kd: RGTextureImage, map_Ks: RGTextureImage, Ns: Number, d: Number, illum: Number }} values 
     */
    constructor(name = "", values = {}){

        this.name = name;

        this.texLoaded = 0;
        this.texToLoad = 0;

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
    checkLoaded = (loadCallBack) => {
        if(this.texLoaded == this.texToLoad){
            loadCallBack();
        }
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
;// ./src/materials/RGTextureImage.mjs


class RGTextureImage{
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
;// ./src/materials/RGMaterialLoader.mjs




class RGMaterialLoader {

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
;// ./src/management/RGCamera.mjs





class RGCamera{

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
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(-this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            left : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(-this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(-this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            right : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            top : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(-this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(this.settings.viewportWidth/2,this.settings.viewportHeight/2,this.settings.focalLength)))
            ]),
            bottom : RGPlane.fromPoints([
                this.pos,
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength))),
                this.pos.plus(this.rot.rotate3dPoint(new RGVec3(-this.settings.viewportWidth/2,-this.settings.viewportHeight/2,this.settings.focalLength)))
            ])
        }
    }

    getSettings = function(){
        return this.settings;
    }

}
;// ./src/webpack_entry.mjs


















RG = __webpack_exports__;
/******/ })()
;