import { tell } from "./tell";
import { Global, fSet, setG, fIsSet, fClear } from "./globals";

function findObject(array, object) {
  return array.find((item) => item.name === object);
}

const traversal = {
  conditional: function (info, destination, user, elseText) {
    return function () {
      const test = info();
      console.log(test);
      return {
        type: "conditional",
        destination: destination,
        user: user,
        movePossible: test,
        elseText: elseText,
      };
    };
  },

  unconditional: function (destination, user) {
    return function () {
      return {
        type: "unconditional",
        destination: destination,
        user: user,
        movePossible: true,
      };
    };
  },
  neverExit: function (text) {
    return function () {
      return {
        type: "neverExit",
        text: text,
      };
    };
  },
  doorExit: function (destination, user, object, text) {
    return function () {
      console.log(destination);
      let textOp = text ? text : `The ${object.desc} is closed`;
      let movePossible = false;
      if (object.flags.includes("openBit")) movePossible = true;
      return {
        type: "doorExit",
        destination: destination,
        user: user,
        movePossible: movePossible,
        text: textOp,
      };
    };
  },
  trapDoorExit: function (destination, user, object) {
    return function () {
      let text;
      let movePossible = false;
      if (Global.rugMoved === false) text = "You can't go that way";
      else {
        if (!object.flags.includes("openBit"))
          text = "The trap door is closed.";
        else movePossible = true;
      }
      return {
        type: "functionExit",
        destination: destination,
        user: user,
        movePossible: movePossible,
        text: text,
      };
    };
  },
};
const room = {
  f_corridor: function (txt, objects) {
    console.log(objects);
    const door = findObject(objects.roomObjects, "woodendoor");
    if (!door.flags.includes("openBit")) option = `closed shut`;
    else option = `wide open`;
    if (txt === "f_look") {
      tell(
        `You are standing in a corridor, in front of you is a door, which is currently ${option}`
      );
    }
  },
  f_livingrooom: function (txt, objects) {
    const trapDoor = findObject(objects.roomObjects, "trapdoor");

    console.log(objects);
    let textOption;
    if (txt === "f_look") {
      const options = {
        default: "and a large oriental rug in the center of the room.",
        rugMove: "and a closed trap door at your feet.",
        trapOpen: "and a rug lying beside an open trap door.",
      };
      if (Global.rugMoved === false) textOption = options.default;
      else if (Global.rugMoved === true && trapDoor.flags.includes("openBit"))
        textOption = options.trapOpen;
      else textOption = options.rugMove;

      tell(
        `You are in the living room. There is a doorway to the south ${textOption}`
      );
    }
  },
};

const object = {
  f_trapdoor: function (objects) {},

  f_rug: function (reference, rug, objects) {
    if (reference === "f_move") {
      const trapDoor = objects.get("trapdoor");
      if (Global.rugMoved)
        tell(
          `"Having moved the carpet previously, you find it impossible to moveit again.`
        );
      else {
        tell(
          "With a great effort, the rug is moved to one side of the room, revealing the dusty cover of a closed trap door."
        );
        fClear(trapDoor, "invisible");
        setG("rugMoved", true);
      }
    }
  },
};
export { room, object, traversal };
