const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width = window.innerWidth;
const HEIGHT = canvas.height = window.innerHeight;

const myContext = RG.Context.createFromCanvas2d(ctx,1)
const myCamera = new RG.Camera(new RG.Vec3(0,0,-15));
const mySceneRenderer = new RG.SceneRenderer(myContext,myCamera)
const myScene = new RG.Scene();

rot = 0;

pikaMat = new RG.MaterialLoader('rsc/capsule/capsule.mtl','rsc/capsule/',()=>{
    myScene.useMTLs(pikaMat.getMaterials())
})

file = new RG.ObjLoader('rsc/capsule/capsule.obj', () => {
    file.getObjects().forEach(o=>{
        o.setPos(new RG.Vec3(0,0,0))
        o.scaleTo(4)
        myScene.add(o)
    })

    requestAnimationFrame(loop)

})

keys={
    KeyW:false,
    KeyA:false,
    KeyS:false,
    KeyD:false,

    Space:false,
    ShiftLeft:false,

    ArrowRight:false,
    ArrowLeft:false,
    ArrowUp:false,
    ArrowDown:false,

    KeyE:false,
    KeyQ:false,
}

document.addEventListener('keydown',(e)=>{
    keys[e.code] = true;
})
document.addEventListener('keyup',(e)=>{
    keys[e.code] = false;
})

function loop(){

    rot += Math.PI/180 * 2;
    file.getObjects().forEach(o=>{o.rotateAround(new RG.Vec3(0,0,0),rot,new RG.Vec3(0,1,0))})

    if(keys.KeyA){myCamera.moveRelative(new RG.Vec3(-0.3,0,0))}
    if(keys.KeyD){myCamera.moveRelative(new RG.Vec3(0.3,0,0))}
    if(keys.KeyW){myCamera.moveRelative(new RG.Vec3(0,0,0.3))}
    if(keys.KeyS){myCamera.moveRelative(new RG.Vec3(0,0,-0.3))}
    if(keys.Space){myCamera.moveRelative(new RG.Vec3(0,0.3,0))}
    if(keys.ShiftLeft){myCamera.moveRelative(new RG.Vec3(0,-0.3,0))}

    if(keys.ArrowLeft){
        myCamera.rotateAroundSelf(-Math.PI/180, new RG.Vec3(0,1,0))
    }
    if(keys.ArrowDown){
        myCamera.rotateAroundSelf(Math.PI/180, new RG.Vec3(1,0,0))
    }
    if(keys.ArrowRight){
        myCamera.rotateAroundSelf(Math.PI/180, new RG.Vec3(0,1,0))
    }
    if(keys.ArrowUp){
        myCamera.rotateAroundSelf(-Math.PI/180, new RG.Vec3(1,0,0))
    }
    if(keys.KeyE){
        myCamera.rotateAroundSelf(Math.PI/180, new RG.Vec3(0,0,1))
    }
    if(keys.KeyQ){
        myCamera.rotateAroundSelf(-Math.PI/180, new RG.Vec3(0,0,1))
    }

    mySceneRenderer.drawFrame(myScene);

    requestAnimationFrame(loop);

}

