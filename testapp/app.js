const canvas = document.getElementById('render');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const myContext = RG.Context.createFromCanvas2d(ctx,1)
let rot=0;

const myCamera = new RG.Camera(
    // A 3d dimensional vector representing the position of our camera in world space
    new RG.Vec3(0,0,-15)
);

const mySceneRenderer = new RG.SceneRenderer(myContext,myCamera)
const myScene = new RG.Scene();

let testObject;

let loader = new RG.ObjLoader("./rsc/capsule/capsule.obj", () => {
    // After the cat file has loaded, lets add the objects
    // contained in it into our scene. 

    // Lets also scale and rotate a bit.

    testObject = loader.getObjects()[0]
    testObject.scaleTo(4);
    myScene.add(testObject)

})


// Passing a .mtl file, and a directory for the loader to search for texture files
let mtlLoader = new RG.MaterialLoader('./rsc/capsule/capsule.mtl', './rsc/capsule/', ()=>{
    // Lets give the scene the loaded materials
    myScene.useMTLs(mtlLoader.getMaterials());

    // And finally, lets render our scene:
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
    testObject.rotateAround(new RG.Vec3(0,0,0),rot,new RG.Vec3(0,1,0))

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

