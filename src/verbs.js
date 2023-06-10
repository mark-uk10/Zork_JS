import { tell } from "./tell";

//let setVerb = "";

const verbRoutines = new Map();

verbRoutines.set('f_look',function(room,objects){
    
    containsSomething = function (container, contained) {
        return contained.some(item => {
            return item.location === container.name;
        });
    }

    displayLevel = function (toDisplay, element, ){
        tell(`${toDisplay}`,element)
    }

    //run obj function if neccesary
    const objFunction = function() {
        for (const element of objects.roomObjects) {
          if (element.hasOwnProperty("objRoutine")) {
            const send = {
              container: element,
              level1: objects.objectsLevel1
            };
            const routine = element.objRoutine(send);
            return routine;
          }
        }
      };

    // describe objects with fDesc and all contining objects only need 2 levels and 1 level of containment realisticly
    const tellFdesc = function(){
        objects.roomObjects.forEach(element => {
            if (!element.flags.includes("noDescBit") && !element.flags.includes("touchBit")){
                if ('fDesc' in element)
                    tell(element.fDesc)
                    if (containsSomething(element,objects.objectsLevel1) && (element.flags.includes("openBit") || element.flags.includes("transBit"))){
                        tell(`The ${element.desc} contains :`)
                        objects.objectsLevel1.forEach(subItem => {
                            if (subItem.location === element.name && !subItem.flags.includes("noDescBit")) {
                              displayLevel(`A ${subItem.desc}`, "h1");
                            }
                          });
                    }
            }
        });
        objects.objectsLevel1.forEach(element => {
            if (!element.flags.includes("noDescBit") && !element.flags.includes("touchBit")){
                if ('fDesc' in element){
                    tell(element.fDesc)
                    if (containsSomething(element,objects.objectsLevel2) && (element.flags.includes("openBit") || element.flags.includes("transBit"))){
                        tell(`The ${element.desc} contains :`)
                        objects.objectsLevel2.forEach(subItem => {
                            if (subItem.location === element.name && !subItem.flags.includes("noDescBit")) {
                              displayLevel(`A ${subItem.desc}`, "h1");
                            }
                          });
                    }
                }
            }
        })
    }
    //we tell the Ldesc or desc if item in room level and been touched all levels of containment
    const tellLdesc = function() {
        objects.roomObjects.forEach(element => {
            if (!element.flags.includes("noDescBit") && element.flags.includes("touchBit")) {
                if ('lDesc' in element) {
                    tell(element.lDesc);
                } else {
                    tell(`A ${element.desc} is here`);
                }
    
                if (containsSomething(element, objects.objectsLevel1) && (element.flags.includes("openBit") || element.flags.includes("transBit"))) {
                    tell(`The ${element.desc} contains :`);
                    objects.objectsLevel1.forEach(item => {
                        if (item.location === element.name) {
                            if (!item.flags.includes("noDescBit")) {
                                displayLevel(`A ${item.desc}`, "h1");
                                if (containsSomething(item, objects.objectsLevel2)) {
                                    if (item.flags.includes("openBit") || item.flags.includes("transBit")){
                                    displayLevel(`The ${item.desc} contains :`, "h1");
                                    objects.objectsLevel2.forEach(subItem => {
                                        if (subItem.location === item.name && !subItem.flags.includes("noDescBit")) {
                                          displayLevel(`A ${subItem.desc}`, "h2");
                                        }
                                      });
                                }
                            }
                            }
                        }
                    });
                }
            }
        });
    }
    
      //we tell the other objects that could be contained in an object but that object has been touched all containment levels
    const tellContainment = function(specialTextCase){

        objects.roomObjects.forEach(roomLevel => {
            if (roomLevel.flags.includes("surfaceBit") || roomLevel.flags.includes("contBit") && roomLevel.flags.includes("noDescBit")){
                
                if (containsSomething(roomLevel, objects.objectsLevel1)) {
                    if (specialTextCase.length > 0) {
                        objects.objectsLevel1.forEach(item => {
                          if (!specialTextCase.some(specialItem => specialItem.name === item.name) && item.flags.includes("touchBit")) {
                            tell(`There is a ${item.desc} here`)
                          }
                        });
                      }
                    else{
                        if (roomLevel.flags.includes("surfaceBit") && roomLevel.flags.includes("contBit"))
                            tell(`sitting on the ${roomLevel.desc} is:`)
                        else if (roomLevel.flags.includes("contBit"))
                            tell(`The ${roomLevel.desc} contains:`)
                        objects.objectsLevel1.forEach(level1 => {
                            if (level1.location === roomLevel.name && !level1.flags.includes("noDescBit"))
                            displayLevel(`A ${level1.desc}`, "h1");
                            if (containsSomething(level1,objects.objectsLevel2)){
                                if (level1.flags.includes("openBit") || level1.flags.includes("transBit"))
                                displayLevel(`The ${level1.desc} contains :`, "h1");
                                objects.objectsLevel2.forEach(level2 => {
                                    if (level2.location === level1.name && !level2.flags.includes("noDescBit")) {
                                      displayLevel(`A ${level2.desc}`, "h2");
                                      if (containsSomething(level2,objects.objectsLevel3)){
                                        if (level2.flags.includes("openBit") || level2.flags.includes("transBit")){
                                            displayLevel(`The ${level2.desc} contains :`, "h2");
                                            objects.objectsLevel3.forEach(level3 => {
                                                if (level3.location === level2.name && !level3.flags.includes("noDescBit")){
                                                    displayLevel(`A ${level3.desc}`, "h3");
                                                }
                                            })
                                        }

                                      }
                                    }
                                  });
                            }
                        })
                    }
                }
            }
        })
    }


    //check for onBit if no on bit state it is pitch black
    if (!room.flags.includes("onBit")){
        tell("It is pitch black.")
    }
    // state room desc then find correct text
    else{
        tell(room.desc)
        if (room.lDesc)
            tell(room.lDesc)
        else{
            room.roomRoutine("f_look",objects.roomObjects)
        }
        objFunction()
        const specialtextCase = objFunction()
        tellFdesc()
        tellLdesc()
        tellContainment(specialtextCase)
    }
    
})
verbRoutines.set('f_pour', function(){
    
})


export{verbRoutines,setVerb}