import { tell } from "./tell"

function findObject(array, object) {return array.find(item => item.name === object);}

const traversal = {
    unconditional: function(){

    },
    conditional:function(){
    
    },
    nExit:function(){
    
    }
}

const room = {
    f_kitchen: function(text){
        return(text)
    },
    f_corridor: function(txt,objects){
         const door = findObject(objects,"door")
         if (!door.flags.includes("openBit"))
             option = `closed shut`
         else
             option = `wide open`
        if (txt === "f_look"){
            tell(`You are standing in a corridor, in front of you is a door, which is currently ${option}`)
        }
    }
}

const object = {
    f_trapDoorExit: function(text){
        return(text)

    },
    f_table: function(objects) {
        const sittingObjects = objects.level1.filter(item => {
          return (item.location === objects.container.name && item.fDesc.includes("sitting") && !item.flags.includes("touchBit"));
        });
        return sittingObjects;
      }
}
export{traversal,room,object}

