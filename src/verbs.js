import { tell } from "./tell";
import { Global, fSet, fIsSet, pickOne } from "./globals";
import { user } from "./dungeon";

const yuks = [
  "A valiant attempt.",
  "You can't be serious.",
  "Not bloody likely.",
  "An interesting idea...",
  "What a concept!",
];

const containsSomething = function (container, items) {
  if (!fIsSet(container, "contBit")) {
    return [];
  }

  return items.filter((item) => {
    return item.location === container.name;
  });
};

// const containsSomething = function (container, contained) {
//   if (!fIsSet(container, "contBit")) {
//     return false;
//   }
//   return contained.some((item) => {
//     return item.location === container.name;
//   });
// };

function seeInside(obj) {
  return (
    !obj.includes("invisible") &&
    (obj.includes("transBit") || obj.includes("openBit"))
  );
}

const verbRoutines = new Map();

verbRoutines.set("f_save", {
  save: function (objects) {
    localStorage.setItem("data", JSON.stringify(objects.get("rug")));
    localStorage.setItem("globalVar", JSON.stringify(Global));
    tell("saved");
  },
}),
  verbRoutines.set("f_load", {
    load: function (objects) {
      const userData = JSON.parse(localStorage.getItem("data"));
      const globalData = JSON.parse(localStorage.getItem("globalVar"));
      if (userData) {
        objects.set("rug", userData);
        console.log("Loaded rug data:", userData);
        tell("loaded");
      }
      if (globalData) {
        // Update the Global object
        Object.assign(Global, globalData);
        console.log("Loaded global data:", globalData);
      }
    },
  }),
  verbRoutines.set("f_move", {
    move: function (object, objects) {
      if (object.objectRoutine) {
        object.objectRoutine("f_move", object, objects);
      } else if (fIsSet(object, "takeBit"))
        tell("Moving the " + object.desc + " reveals nothing.");
      else tell("You can't move the " + object.desc);
    },
  }),
  verbRoutines.set("f_verbosity", {
    verbose: function () {
      Global.verbose = true;
      Global.superBrief = false;
      tell("Maximum verbosity.");
    },
    brief: function () {
      Global.superBrief = false;
      Global.verbose = false;
      tell("Brief descriptions.");
    },
    superBrief: function () {
      Global.superBrief = true;
      Global.verbose = false;
      tell("Superbrief descriptions.");
    },
  }),
  verbRoutines.set("f_back", {
    back: function () {
      tell("Sorry, my memory is poor. Please give a direction.");
    },
  }),
  verbRoutines.set("f_blast", {
    blast: function () {
      tell("You can't blast anything by using words.");
    },
  }),
  verbRoutines.set("f_brush", {
    brush: function () {
      tell("If you wish, but heaven only knows why.");
    },
  }),
  verbRoutines.set("f_bug", {
    bug: function () {
      tell("Bug? Not in a flawless program like this! (Cough, cough).");
    },
  }),
  verbRoutines.set("f_chomp", {
    chomp: function () {
      tell("Preposterous!");
    },
  }),
  verbRoutines.set("f_follow", {
    follow: function () {
      tell("You're nuts!");
    },
  }),
  verbRoutines.set("f_frobozz", {
    frobozz: function () {
      tell("The FROBOZZ Corporation created, owns, and operates this dungeon.");
    },
  }),
  verbRoutines.set("f_hatch", {
    hatch: function () {
      tell("Bizzare!");
    },
  }),
  verbRoutines.set("f_lookUnder", {
    lookUnder: function () {
      tell("There is nothing but dust there.");
    },
  }),
  verbRoutines.set("f_make", {
    make: function () {
      tell("You can't do that.");
    },
  }),
  verbRoutines.set("f_open", {
    open: function (object, allObjects) {
      if (fIsSet(object.flags, "contBit")) {
        if (object.hasOwnProperty("capacity") != 0) {
          if (fIsSet(object.flags, "openBit")) {
            tell("It is already open.");
          } else {
            fSet(object, "touchBit");
            fSet(object, "openBit");
            if (
              fIsSet(object.flags, "transBit") ||
              !containsSomething(object, allObjects)
            ) {
              tell("opened.");
            } else {
              const descriptions = containsSomething(object, allObjects).map(
                (item) => item.desc
              );
              if (descriptions.length > 1) {
                const lastDesc = descriptions.pop();
                const join = descriptions.join(", a ");
                tell(
                  `Opening the ${object.desc} reveals a ${join}, and a ${lastDesc}`
                );
              } else {
                tell(`Opening the ${object.desc} reveals a ${descriptions}`);
              }
            }
          }
        }
      } else if (fIsSet(object.flags, "doorBit")) {
        if (fIsSet(object.flags, "openBit")) {
          tell("It is already open.");
        } else {
          tell(`The ${object.desc} opens.`);
          fSet(object, "openBit");
          fSet(object, "touchBit");
        }
      } else tell(`You must tell me how to do that to a ${object.desc}`);
    },
  }),
  verbRoutines.set("f_plug", {
    plug: function () {
      tell("This has no effect.");
    },
  }),
  verbRoutines.set("f_inventory", {
    inventory: function (objects) {
      if (!objects.combinedInv.length) tell("You are empty-handed.");
      else {
        tell("You are carrying:");
        objects.lvl0.forEach((element) => {
          if (
            containsSomething(element, objects.lvl1) &&
            seeInside(element.flags)
          ) {
            tell(`A ${element.desc}`);
            verbRoutines
              .get("f_look")
              .containment(element, objects.lvl1, 1, objects);
          } else tell(`A ${element.desc}`);
        });
      }
    },
  }),
  verbRoutines.set("f_drop", {
    preDrop: function (context) {
      console.log(context);
      this.drop(context);
    },
    drop: function (context) {
      if (this.iDrop(context)) {
        tell("dropped");
      }
    },
    iDrop: function (context) {
      const { obj, loc, finalLoc, userLoc } = context;
      if (finalLoc !== "inv") {
        tell(`You're not carrying the ${obj.desc}`);
        return false;
      } else if (loc && !fIsSet(loc, "openBit")) {
        tell(`The ${loc.desc} is closed.`);
        return false;
      } else {
        obj.location = userLoc;
        return true;
      }
    },
  });
verbRoutines.set("f_take", {
  preTake: function (obj, loc) {
    if (obj.location === "inv") {
      if (fIsSet(obj.flags, "wearBit")) tell("You are already wearing it.");
      else tell("You already have that!");
    } else {
      if (fIsSet(loc, "contBit") && !fIsSet(loc, "openBit"))
        tell("You can't reach something that's inside a closed container.");
      else this.take(obj);
    }
  },
  take: function (obj) {
    if (this.iTake(obj)) {
      if (fIsSet(obj.flags, "wearBit")) {
        tell(`You are now wearing the ${obj.desc}`);
      } else tell("taken");
    }
  },
  iTake: function (obj) {
    //use this function for weight limits capacity limits any special effects for global vars involving take
    if (!fIsSet(obj, "takeBit")) {
      tell(pickOne(yuks));
    } else {
      obj.location = "inv";
      return true;
    }
  },
}),
  verbRoutines.set("f_examine", {
    examine: function (object, allObjects) {
      if ("text" in object) {
        tell(object.text);
      } else if (
        object.flags.includes("contBit") ||
        object.flags.includes("doorBit")
      ) {
        this.lookInside(object, allObjects);
      } else {
        tell(`There's nothing special about the ${object.desc}`);
      }
    },
    lookInside: function (object, allObjects) {
      console.log(allObjects);
      console.log(object);
      function findLevelNumberByName(levels, name) {
        for (const [levelKey, objects] of Object.entries(levels)) {
          if (objects.some((obj) => obj.name === name)) {
            return parseInt(levelKey.replace("lvl", ""), 10) + 1; // Adjust to 1-based indexing
          }
        }
        return null; // Object not found
      }

      function levels() {
        if (object.location === "inv")
          return {
            lvl0: allObjects.invObjects.lvl0,
            lvl1: allObjects.invObjects.lvl1,
            lvl2: allObjects.invObjects.lvl2,
          };
        else
          return {
            lvl0: allObjects.roomObjects,
            lvl1: allObjects.objectsLevel1,
            lvl2: allObjects.objectsLevel2,
            lvl3: allObjects.objectsLevel3,
          };
      }

      if (object.flags.includes("doorBit")) {
        if (object.flags.includes("openBit"))
          tell(
            `The ${object.desc} is open, but I can't tell what's beyond it.`
          );
        else tell(`The ${object.desc} is closed.`);
      } else if (object.flags.includes("contBit")) {
        if (object.flags.includes("surfaceBit")) {
          if (containsSomething(object, allObjects.combinedObjects)) {
            verbRoutines
              .get("f_look")
              .containment(
                object,
                allObjects.objectsLevel1,
                1,
                levels(),
                `on the ${object.desc} is :`
              );
          } else tell(`There is nothing on the ${object.desc}`);
        } else {
          if (seeInside(object.flags)) {
            if (containsSomething(object, allObjects.combinedObjects)) {
              const filteredItems = allObjects.combinedObjects.filter(
                (item) => item.location === object.name
              );
              const startLvl = findLevelNumberByName(levels(), object.name);
              verbRoutines
                .get("f_look")
                .containment(object, filteredItems, startLvl, levels());
            } else tell(`The ${object.desc} is empty`);
          } else tell(`The ${object.desc} is closed`);
        }
      } else tell(`You can't look inside a ${object.desc}`);
    },
  }),
  verbRoutines.set("f_look", {
    containment: function (object, startLvl, iterate, levels, surfaceTxt) {
      const displayLevel = function (toDisplay, element) {
        tell(`${toDisplay}`, element);
      };

      if (surfaceTxt) {
        tell(surfaceTxt);
      } else {
        tell(`The ${object.desc} contains :`);
      }

      for (const lvlItemA of startLvl) {
        if (lvlItemA.location === object.name) {
          displayLevel(`A ${lvlItemA.desc}`, "h1");
          if (
            containsSomething(lvlItemA, levels[`lvl${iterate + 1}`]) &&
            seeInside(lvlItemA.flags)
          ) {
            displayLevel(`The ${lvlItemA.desc} contains :`, "h1");
            const nextLevelB = levels[`lvl${iterate + 1}`];
            for (const lvlItemB of nextLevelB) {
              if (lvlItemB.location === lvlItemA.name) {
                displayLevel(`A ${lvlItemB.desc}`, "h2");
                if (
                  containsSomething(lvlItemB, levels[`lvl${iterate + 2}`]) &&
                  seeInside(lvlItemB.flags)
                ) {
                  displayLevel(`The ${lvlItemB.desc} contains :`, "h2");
                  const nextLevelC = levels[`lvl${iterate + 2}`];
                  for (const lvlItemC of nextLevelC) {
                    if (lvlItemC.location === lvlItemB.name) {
                      displayLevel(`A ${lvlItemC.desc}`, "h3");
                    }
                  }
                }
              }
            }
          }
        }
      }
    },

    describeRoom: function (room, objects) {
      const canSee = room.flags.includes("onBit");
      if (!canSee) {
        tell("I'ts too dark to see!");
        return;
      } else tell(room.desc);
      room.roomRoutine ? room.roomRoutine("f_look", objects) : tell(room.lDesc);
    },
    describeRoomNew: function (room, objects) {
      const canSee = room.flags.includes("onBit");
      if (!canSee) {
        tell("I'ts too dark to see!");
        return;
      } else {
        tell(room.desc);
      }

      if (Global.verbose || !room.flags.includes("touchBit")) {
        room.roomRoutine
          ? room.roomRoutine("f_look", objects)
          : tell(room.lDesc);
        fSet(room, "touchBit");
      }
    },

    describeObjects: function (room, objects) {
      const canSee = room.flags.includes("onBit");
      const levels = {
        lvl0: objects.roomObjects,
        lvl1: objects.objectsLevel1,
        lvl2: objects.objectsLevel2,
        lvl3: objects.objectsLevel3,
      };

      const tellObjects = (object, start) => {
        const iterate = start;
        const lvl = levels[`lvl${start}`];

        if (
          object.flags.includes("noDescBit") &&
          containsSomething(object, lvl) &&
          seeInside(object.flags)
        ) {
          const filteredItems = levels.lvl1.filter(
            (item) =>
              item.location === object.name &&
              (item.flags.includes("touchBit") || !("fDesc" in item))
          );
          if (filteredItems.length > 0) {
            verbRoutines
              .get("f_look")
              .containment(
                object,
                filteredItems,
                iterate,
                levels,
                `on the ${object.desc} is :`
              );
          }
        }

        if (
          object.flags.includes("noDescBit") ||
          object.flags.includes("invisible")
        ) {
          return;
        }
        if (!object.flags.includes("touchBit") && "fDesc" in object) {
          tell(object.fDesc);
          if (containsSomething(object, lvl) && seeInside(object.flags)) {
            verbRoutines
              .get("f_look")
              .containment(object, lvl, iterate, levels);
          }
        } else if (
          object.flags.includes("touchBit") &&
          object.location === room.name &&
          "lDesc" in object
        ) {
          tell(object.lDesc);
          if (containsSomething(object, lvl) && seeInside(object.flags)) {
            verbRoutines
              .get("f_look")
              .containment(object, lvl, iterate, levels);
          }
        } else if ("desc" in object && object.location === room.name) {
          tell(`There is a ${object.desc} here`);
          if (containsSomething(object, lvl) && seeInside(object.flags)) {
            verbRoutines
              .get("f_look")
              .containment(object, lvl, iterate, levels);
          }
        } else if (
          "desc" in object &&
          object.location === "globalObjects" &&
          !object.flags.includes("noDescBit")
        ) {
          tell(`There is a ${object.desc} here`);
        }
      };

      if (!canSee) {
        return;
      }

      levels.lvl0.forEach((object) => tellObjects(object, 1));
      levels.lvl1
        .filter((object) => object.hasOwnProperty("fDesc"))
        .forEach((object) => tellObjects(object, 2));
    },

    look: function (location, objects) {
      this.describeRoom(location, objects);
      this.describeObjects(location, objects);
    },

    firstLook: function (location, objects) {
      this.describeRoomNew(location, objects);
      if (Global.superBrief === false) {
        this.describeObjects(location, objects);
      }
    },
  });

verbRoutines.set("f_traversal", {
  tryMove: function (direction, location) {
    const canMove = direction in location ? location[direction]() : false;

    if (!canMove || !canMove.type) {
      tell("You cant go that way");
      return;
    }

    switch (canMove.type) {
      case "unconditional":
        return unconditional(canMove);
      case "doorExit":
        return doorExit(canMove);
      case "neverExit":
        return neverExit(canMove);
      case "functionExit":
        return functionExit(canMove);
      case "conditional":
        return conditional(canMove);
    }

    function unconditional(canMove) {
      if (canMove.movePossible)
        return {
          destination: canMove.destination,
          user: canMove.user,
        };
    }
    function doorExit(canMove) {
      if (!canMove.movePossible)
        if (canMove.hasOwnProperty("text")) tell(canMove.text);
        else tell(`The ${canMove.text} is closed.`);
      else
        return {
          destination: canMove.destination,
          user: canMove.user,
        };
    }
    function neverExit(canMove) {
      tell(canMove.text);
    }
    function functionExit(canMove) {
      if (!canMove.movePossible) tell(canMove.text);
      else {
        return {
          destination: canMove.destination,
          user: canMove.user,
        };
      }
    }
    function conditional(canMove) {
      if (!canMove.movePossible)
        if (canMove.hasOwnProperty("elseText")) tell(canMove.elseText);
        else tell(`You cant go that way`);
      else
        return {
          destination: canMove.destination,
          user: canMove.user,
        };
    }
  },

  moveAndLook: function (info) {
    info.user.set("location", info.destination);
    return info.destination;
  },
});

export { verbRoutines };
