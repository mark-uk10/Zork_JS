import { room, traversal, object } from "./actions.js";
import { globalObjects } from "./globals.js";

const user = new Map();
user.set("location", "kitchen");

const objects = new Map();
const localGlobals = new Map();

localGlobals.set("globalwater", {
  name: "globalwater",
  location: "localGlobals",
  synonym: ["water"],
  desc: "water",
  flags: ["tryTakeBit", "drinkBit", "takeBit"],
});
localGlobals.set("woodendoor", {
  name: "woodendoor",
  synonym: ["door", "wooden", "woodendoor"],
  desc: "wooden door",
  location: "localGlobals",
  flags: ["doorBit", "noDescBit", "openBit"],
});

objects.set("water", {
  name: "water",
  synonym: ["quantity"],
  location: "bottle",
  desc: "quantity of water",
  flags: ["tryTakeBit", "drinkBit", "takeBit"],
});
objects.set("bag", {
  name: "bag",
  location: "kitchen",
  fDesc: "on the table is an elongated brown sack smelling of hot peppers",
  desc: "brown sack",
  flags: ["takeBit", "contBit", "burnBit", "openBit", "touchBit"],
  capacity: 9,
  size: 9,
});
objects.set("bottle", {
  name: "bottle",
  location: "table",
  desc: "glass bottle",
  fDesc: "A bottle is sitting on the table",
  lDesc: "A clear glass bottle is here",
  flags: ["takeBit", "transBit", "contBit"],
  capacity: 1,
});
objects.set("table", {
  name: "table",
  location: "kitchen",
  desc: "kitchen table",
  flags: ["contBit", "surfaceBit", "openBit", "noDescBit"],
  capacity: 99,
});

objects.set("lunch", {
  name: "lunch",
  location: "kitchen",
  desc: "lunch",
  flags: ["takeBit", "foodBit"],
});
objects.set("garlic", {
  name: "garlic",
  location: "bag",
  desc: "clove of garlic",
  flags: ["takeBit", "foodBit"],
  size: 4,
});
objects.set("leaflet", {
  name: "leaflet",
  synonym: ["leaflet", "booklet", "mail"],
  location: "inv",
  desc: "leaflet",
  flags: ["takeBit", "readBit", "burnBit"],
  text: `"WELCOME TO ZORK!
    ZORK is a game of adventure, danger, and low cunning. In it you
    will explore some of the most amazing territory ever seen by mortals.
    No computer should be without one!"`,
});

objects.set("picture", {
  name: "picture",
  location: "corridor",
  desc: "picture",
  fDesc: "A picture of an old man is hanging on the wall",
  lDesc: "The picture of the old man is lying on the floor",
  flags: [],
});

objects.set("trapdoor", {
  name: "trapdoor",
  synonym: ["trap", "cover", "door", "trap-door", "trapdoor"],
  location: "livingroom",
  desc: "trap door",
  flags: ["noDescBit", "doorBit", "invisible"],
});
objects.set("rug", {
  name: "rug",
  synonym: ["carpet"],
  location: "livingroom",
  desc: "carpet",
  flags: ["noDescBit", "tryTakeBit"],
  objectRoutine: (txt, item, items) => object.f_rug(txt, item, items),
});

let objectWords = {
  localGlobals: {},
  globalObjects: {},
  objects: {},
};

objects.forEach((value, key) => {
  const synonyms = value.synonym || [];
  if (!objectWords.objects[key]) {
    objectWords.objects[key] = [];
  }
  objectWords.objects[key].push(...[key, ...synonyms]);
});

globalObjects.forEach((value, key) => {
  const synonyms = value.synonym || [];
  if (!objectWords.globalObjects[key]) {
    objectWords.globalObjects[key] = [];
  }
  objectWords.globalObjects[key].push(...[key, ...synonyms]);
});

localGlobals.forEach((value, key) => {
  const synonyms = value.synonym || [];
  if (!objectWords.localGlobals[key]) {
    objectWords.localGlobals[key] = [];
  }
  objectWords.localGlobals[key].push(...[key, ...synonyms]);
});

//room defintions

const rooms = new Map();

rooms.set("kitchen", {
  name: "kitchen",
  lDesc:
    "you are standing in the kitchen of the house. A table seems to have been used recently for the preperation of food. To the north there is a dark passage",
  desc: "Kitchen",
  north: traversal.unconditional("corridor", user),
  east: traversal.neverExit(
    "you can never go this way and this is a text that makes it more interesting"
  ),
  south: traversal.unconditional("forest", user),
  flags: ["landBit", "onBit"],
});
rooms.set("corridor", {
  name: "corridor",
  desc: "corridor",
  flags: ["landBit", "onBit"],
  north: traversal.doorExit("livingroom", user, localGlobals.get("woodendoor")),
  south: traversal.unconditional("kitchen", user),
  globals: [localGlobals.get("woodendoor")],
  roomRoutine: (txt, objects) => room.f_corridor(txt, objects),
});
rooms.set("forest", {
  name: "forest",
  desc: "Forest",
  lDesc:
    "This is a forest, with trees in all directions. A shallow river flows to the south. To the north, there appears to be an entrance to a house.",
  flags: ["landBit", "onBit"],
  north: traversal.unconditional("kitchen", user),
  up: traversal.neverExit("There is no tree here suitable for climbing."),
  globals: [localGlobals.get("globalwater")],
});
rooms.set("livingroom", {
  name: "livingroom",
  desc: "Living Room",
  south: traversal.unconditional("corridor", user),
  down: traversal.trapDoorExit("cellar", user, objects.get("trapdoor")),
  flags: ["landBit", "onBit"],
  globals: [localGlobals.get("woodendoor")],
  roomRoutine: (txt, objects) => room.f_livingrooom(txt, objects),
});
rooms.set("cellar", {
  name: "cellar",
  lDesc:
    "You are in a cold, dark cellar. A flickering, nearly exhausted lamp hanging from the wall is your only source of light. the dim light barely illuminates the stone walls of this empty place",
  desc: "dusty cellar",
  up: traversal.unconditional("livingroom", user),
  flags: ["landbit", "onBit"],
});

export { rooms, objects, localGlobals, user, objectWords };
