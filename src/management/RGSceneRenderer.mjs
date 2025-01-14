export class RGSceneRenderer{

    constructor(rgContext,rgCamera){
        this.rgContext = rgContext;
        this.rgCamera = rgCamera;
    }

    drawFrame = function(rgScene){
        rgScene.render(this.rgContext,this.rgCamera);
    }
}