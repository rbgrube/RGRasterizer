export class RGScene{
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