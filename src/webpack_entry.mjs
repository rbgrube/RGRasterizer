import { RGContext } from "./management/RGContext.mjs";
import { RGScene } from "./management/RGScene.mjs";
import { RGSceneRenderer } from "./management/RGSceneRenderer.mjs";
import { ObjLoader } from "./primitaves/OBJ/OBJLoader.mjs";
import { RGMaterialLoader } from "./materials/RGMaterialLoader.mjs";

import { RGTriangleObject } from "./primitaves/RGTriangleObject.mjs";
import { RGTriangleRenderer } from "./primitaves/RGTriangleRenderer.mjs";

import { RGVec2 } from "./util/RGVec2.mjs";
import { RGVec3 } from "./util/RGVec3.mjs";
import { RGCamera } from "./management/RGCamera.mjs";
import { RGColor } from "./util/RGColor.mjs";



export {
    RGContext as Context,
    RGScene as Scene,
    RGSceneRenderer as SceneRenderer,
    RGCamera as Camera,
    ObjLoader as ObjLoader,
    RGMaterialLoader as MaterialLoader,

    RGTriangleObject as TriangleObject,
    RGTriangleRenderer as TriangleRenderer,

    RGColor as Color,
    RGVec2 as Vec2,
    RGVec3 as Vec3
}
