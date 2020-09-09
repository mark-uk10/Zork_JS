
//direction descrption. the direction key to go to / the room you go to / bool if you can or cant go that way / text for not allowing to go that wat / text for if you do go that way
const roomCollection = [
    {
        name: "kitchen",
        roomDescription: "you are standing in a small kitchen. A table seems to have been used recently for the preperation of food. there is a door leading to a corridor to the north",
        north: ["n", "corridor", true, "there is a door blocking your way", "you go north"],
        east: ["e", "null", false, "you cant walk through walls"],
        south: ["s", "null", false, "you cant walk throught walls"],
        west: ["w", "null", false, "you cant walk throught walls"]
            },
    {
        name: "corridor",
        roomDescription: "you are in a well lit blue and white corridor, the kitchen is to the south, and there is a bedroom to the east",
        north: ["n", "null", false, "you cant walk through walls"],
        east: ["e", "bedroom", true, "the door is locked", "you go east"],
        south: ["s", "kitchen", true, "you cant walk throught walls", "you go south"],
        west: ["w", "null", false, "you cant walk through walls"]
            },
    {
        name: "bedroom",
        roomDescription: "you are in a bedroom there is a corridor to the west",
        north: ["n", "null", false, "you cant walk through walls"],
        east: ["e", "null", false, "you cant walk through walls"],
        south: ["s", "null", false, "you cant walk through walls"],
        west: ["w", "corridor", true, "you cant walk through walls", "you go west"]
            }];