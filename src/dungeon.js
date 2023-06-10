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
    desc:"quantity of water",
    flags:["tryTakeBit","drinkBit","takeBit"]
})
objects.set('bottle',{
    name:"bottle",
    location:"bag",
    desc:"glass bottle",
    fDesc:"A bottle is sitting on the table",
    lDesc:"A glass bottle is here",
    flags:["takeBit","transBit","contBit","touchBit"]
})
objects.set('lunch',{
    name:"lunch",
    location:"bag",
    lDesc:"A hot pepper sandwich is here",
    desc:"lunch",
    flags:["takeBit","foodBit"]
})
objects.set('garlic',{
    name:"garlic",
    location:"bag",
    desc:"clove of garlic",
    flags:["takeBit","foodBit"]
})
objects.set('table',{
    name:"table",
    location:"kitchen",
    desc:"kitchen table",
    objRoutine: (objectsLevel1) => object.f_table(objectsLevel1),
    flags:["noDescBit","contBit","openBit","surfaceBit"]
})
objects.set('bag',{
    name:"bag",
    location:"table",
    fDesc:"on the table is an elongated brown sack smelling of hot peppers",
    desc:"brown sack",
    flags:["takeBit","contBit","burnBit","touchBit","openBit"]
})
objects.set('picture',{
    name:"picture",
    location:"corridor",
    desc:"picture",
    fDesc:"A picture of an old man is sitting on the table",
    lDesc:"The picture of the old man is lying on the floor",
    flags:[]
})
objects.set('door',{
    name:"door",
    location:"corridor",
    flags:["doorBit","lockedBit","noDescBit"]
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
    desc:"corridor",
    flags: ["landBit","onBit"],
    roomRoutine: (txt, objects) => room.f_corridor(txt, objects)
});

export{rooms,objects,user}
