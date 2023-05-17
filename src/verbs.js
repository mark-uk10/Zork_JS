import { tell } from "./tell";

const verbRoutines = new Map();

verbRoutines.set('f_look',function(room,objects){

    const descObjects = function(){
        objects.roomObjects.forEach(element => {
            if (element.fDesc){
                tell(element.fDesc)
            }
        });
    }

    //check for onBit if no on bit state it is pitch black
    if (!room.flags.includes("onBit")){
        tell("It's too dark to see")
    }
    // state room desc then find correct text
    else{
        tell(room.desc)
        if (room.lDesc)
            tell(room.lDesc)
            descObjects()
    }
    
})
verbRoutines.set('f_pour', function(){
    
})


export{verbRoutines}