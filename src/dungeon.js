import { room,object,traversal } from "./actions.js";

//user object
const user = {
    location:"kitchen"
}

//objects

const objects = new Map()

objects.set('water',{
    name:"water",
    location:"bottle",
    desc:"water",
})
objects.set('bottle',{
    name:"bottle",
    location:"kitchen",
    desc:"bottle",
    fDesc:"A bottle is sitting on the table",
    flags:["takeBit"]
})
objects.set('lunch',{
    name:"lunch",
    location:"bag",
    desc:"lunch",
})
objects.set('bag',{
    name:"bag",
    location:"kitchen",
    fDesc:"on the table is an elongated brown sack smelling of hot peppers",
    lDesc:"a sack is lying on the ground",
    desc:"sack",
    flags:["takeBit"]
})
objects.set('picture',{
    name:"picture",
    location:"corridor",
})

export const objectWords = Array.from(objects.keys());


//room defintions

const rooms = new Map()

rooms.set('kitchen',{
    name:"kitchen",
    lDesc: "you are standing in the kitchen of the house. A table seems to have been used recently for the preperation of food, to the north there is a dark passage",
    desc:"Kitchen", //initial output to user
    north: traversal.unconditional('corridor'), //can go this way under all circumstancs
    west: traversal.conditional('livingRoom',"The wooden door is closed"), 
    down: object.f_trapDoorExit("this is a trap door exit routine"),//more complex exit can go this way if trap door open and rug moved
    east: traversal.nExit("hey you cant go this way or you will die"), //no exit with more interesting than default text
    flags: ["landBit","onBit"],
    roomRoutine: room.f_kitchen("this is a kithen routine"),
});
rooms.set('corridor',{
    name:"corridor",
    lDesc:"this is a corridor it is exciting yes?",
    desc:"corridor",
    //south: traversal.conditional('kitchen'),
    flags: ["landBit","onBit"]
});

export{rooms,objects,user}
