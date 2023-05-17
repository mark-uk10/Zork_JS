import { verbRoutines } from "./verbs";
import { tell } from "./tell";
import { objects,rooms,user} from "./dungeon";

const perform = function(object,reference,indObject,verb){

   const objectDef = objects.get(`${object}`)
   const indObjectDef = objects.get(`${indObject}`)
   const location = rooms.get(`${user.location}`)
   const verbRoutine = verbRoutines.get(`${reference}`)
    console.log(location)

   function getObjectsInLocation(location) {
    const roomObjects = Array.from(objects.values()).filter(object => object.location === location);
    const objectsLevel1 = Array.from(objects.values()).filter(object => roomObjects.some(roomObject => roomObject.name === object.location));
    const objectsLevel2 = Array.from(objects.values()).filter(object => objectsLevel1.some(level1Object => level1Object.name === object.location));

    return {
        roomObjects: roomObjects,
        objectsLevel1: objectsLevel1,
        objectsLevel2: objectsLevel2,
    }
}

const allObjects = getObjectsInLocation(location.name);

   console.log(objectDef)
   console.log(indObjectDef)
   console.log(location)
   console.log(verbRoutine)

   if (reference === "f_look")
    verbRoutine(location,allObjects)


}

export{perform}