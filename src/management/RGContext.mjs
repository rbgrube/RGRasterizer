export class RGContext{

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