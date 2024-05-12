import { tell } from "./tell.js";
import { syntax, collectWords } from "./syntax.js";
import { objectWords, objects, rooms, user } from "./dungeon";
import { countMoves } from "./gClock";
import { globalObjects } from "./globals";

sortObjects = function (location) {
  const roomObjects = [];
  const getObjectsInLocation = function () {
    for (const object of objects.values()) {
      if (object.location.includes(location.name)) roomObjects.push(object);
    }
    return roomObjects.concat([...globalObjects.values()]);
  };
  const getInventoryObjects = function () {
    const invLvl0 = [];

    for (const object of objects.values()) {
      if (object.location === "inv") invLvl0.push(object);
    }
    const invLvl1 = Array.from(objects.values()).filter((object) =>
      invLvl0.some((lvl1Object) => lvl1Object.name === object.location)
    );
    const invLvl2 = Array.from(objects.values()).filter((object) =>
      invLvl1.some((lvl2Object) => lvl2Object.name === object.location)
    );
    return {
      lvl0: invLvl0,
      lvl1: invLvl1,
      lvl2: invLvl2,
      combinedInv: invLvl0.concat(invLvl1, invLvl2),
    };
  };
  const setObjectLevels = function () {
    const objectsLevel1 = Array.from(objects.values()).filter((object) =>
      roomObjects.some((roomObject) => roomObject.name === object.location)
    );
    const objectsLevel2 = Array.from(objects.values()).filter((object) =>
      objectsLevel1.some(
        (level1Object) => level1Object.name === object.location
      )
    );
    const objectsLevel3 = Array.from(objects.values()).filter((object) =>
      objectsLevel2.some(
        (level2Object) => level2Object.name === object.location
      )
    );
    return {
      combinedObjects: locationObjects.concat(
        objectsLevel1,
        objectsLevel2,
        objectsLevel3,
        invObjects.combinedInv
      ),
      objectsLevel1: objectsLevel1,
      objectsLevel2: objectsLevel2,
      objectsLevel3: objectsLevel3,
    };
  };

  const invObjects = getInventoryObjects();
  const locationObjects = getObjectsInLocation();
  const objectLevels = setObjectLevels();

  return {
    roomObjects: locationObjects,
    invObjects: invObjects,
    objectsLevel1: objectLevels.objectsLevel1,
    objectsLevel2: objectLevels.objectsLevel2,
    objectsLevel3: objectLevels.objectsLevel3,
    combinedObjects: objectLevels.combinedObjects,
  };
};
const checkWords = function (verbs, input) {
  return (wordNotInArray = input.split(" ").find((word) => !verbs.has(word)));
};

const objectHere = function (toCheck, objectsHere) {
  function seeInside(obj) {
    return (
      !obj.includes("invisible") &&
      (obj.includes("transBit") || obj.includes("openBit"))
    );
  }
  const objectsArray = [];
  const visibleObjects = [];
  const canSee = [];
  let objFinalLocation;
  objectsHere.forEach((item) => {
    if (
      item.name === toCheck ||
      (item.synonym && item.synonym.includes(toCheck))
    )
      objectsArray.push(item.name);
  });
  objectsArray.forEach((object) => {
    objectsHere.forEach((item) => {
      if (item.name === object && !item.flags.includes("invisible")) {
        visibleObjects.push(item.name);
      }
    });
  });
  function canSeeObject(visibleObjects) {
    let currentContainedObject;
    let currentContainer;

    visibleObjects.forEach((objName) => {
      currentContainedObject = objects.get(objName);
      console.log("Inspecting object:", currentContainedObject);

      while (
        currentContainedObject &&
        currentContainedObject.hasOwnProperty("location")
      ) {
        currentContainer = objects.get(currentContainedObject.location);

        // Check if the container exists in the objects map
        if (!currentContainer) {
          console.log(
            "No further container found for:",
            currentContainedObject.name
          );
          if (currentContainedObject.location === "inv")
            console.log("the final location is your inv");
          else
            console.log(
              "the final location is a room",
              currentContainedObject.location
            );

          canSee.push(objName);
          objFinalLocation = currentContainedObject.location;
          break;
        }

        // Check if the contents of the container are visible
        if (!seeInside(currentContainer.flags)) {
          console.log("Cannot see inside:", currentContainer.name);
          break;
        }

        // Log visible container and move deeper if possible
        console.log("Visible container:", currentContainer);
        currentContainedObject = currentContainer; // Move to the next container
      }
    });
  }

  // Adjusted to work as an example call
  canSeeObject(visibleObjects);
  return { canSee: canSee, objFinalLocation: objFinalLocation };
};

const checkObject = function (noun, objectWords) {
  let object;
  let indirectObject;
  let objectInput;

  function findKeyByItem(itemToFind) {
    for (const key in objectWords) {
      if (objectWords[key].includes(itemToFind)) {
        return key;
      }
    }
    return null; // Return null if itemToFind is not found
  }

  if (noun?.groups?.object) {
    objectInput = noun.groups.object;
    object = findKeyByItem(noun.groups.object);
  }

  if (noun?.groups?.indirectObject)
    indirectObject = findKeyByItem(noun.groups.indirectObject);

  const result = {
    object: object,
    indirectObject: indirectObject,
    objectInput: objectInput,
  };

  if (noun?.groups?.object !== undefined && noun?.groups?.object === object) {
    result.objectInput = noun.groups.object;
  }
  return result;
};

const checkSyntax = function (syntax, input) {
  userInputNoSpace = input.replace(/ /g, "");
  let result = false;
  let functionReference = "";
  let isMatchFound = false;
  let verb;

  syntax.some((element) => {
    for (const key in element) {
      for (const nestedKey in element[key]) {
        if (key !== "synonym" && key !== "words") {
          const value = element[key][nestedKey];
          if (typeof value !== "string" && typeof value !== "function") {
            const test = value.exec(userInputNoSpace);
            if (test) {
              functionReference = element[key].f_reference;
              verb = nestedKey;
              result = test;
              isMatchFound = true;
              return true; // stop iterating over the syntax array
            }
          }
        }
      }
    }
    return false;
  });

  return {
    object: result,
    verb: verb,
    f_reference: functionReference,
    isMatchFound: isMatchFound, // indicate whether a match was found or not
  };
};

const evaluateInput = function (input) {
  let PRSA, PRSO, PRSI; //verb
  let userInput = input.trim().toLowerCase();

  const unknownWord = checkWords(collectWords(), userInput);
  const correctSyntax = checkSyntax(syntax, userInput);
  const correctObject = checkObject(correctSyntax.object, objectWords);
  const locationObject = sortObjects(rooms.get(`${user.get("location")}`));
  const hereObject = objectHere(
    correctSyntax?.object?.groups?.object,
    locationObject.combinedObjects
  );
  console.log(correctSyntax);
  console.log(correctObject);
  console.log(locationObject);
  console.log(hereObject);

  if (!userInput) {
    tell("I beg your pardon?");
  } else if (unknownWord) {
    tell(`I don't know the word ${unknownWord}`);
  } else if (correctSyntax.f_reference === "f_error") {
    tell("I do not undetstand that");
  } else if (correctSyntax.isMatchFound && correctSyntax.verb === "waiting") {
    tell(`What do you want to ${correctSyntax.object[0]}?`);
  } else if (
    correctSyntax.isMatchFound &&
    correctSyntax.object.groups &&
    !correctSyntax.object.groups.object.length
  ) {
    tell("There is no noun in that sentance!");
  } else if (
    correctSyntax.isMatchFound &&
    correctSyntax.object.groups &&
    correctSyntax.object.groups.object.length &&
    !correctObject.object
  ) {
    tell("I do not undetstand that");
  } else if (
    correctSyntax.isMatchFound &&
    correctSyntax.object.groups &&
    correctSyntax.object.groups.object.length &&
    correctObject.object &&
    !hereObject.canSee.length
  ) {
    tell(`There is no ${correctObject.objectInput} here!`);
  } else if (
    correctSyntax.isMatchFound &&
    correctSyntax.object.groups &&
    correctSyntax.object.groups.object.length &&
    correctObject.object &&
    hereObject.canSee.length > 1
  ) {
    tell(
      `Which ${correctSyntax.object.groups.object} do you mean, the ${hereObject.canSee[0]} or the ${hereObject.canSee[1]}?`
    );
  } else {
    //if match found true and only one object exists in location
    PRSA = correctSyntax.f_reference;
    PRSO = objects.get(correctObject.object);
    console.log(PRSO);
    PRSI = objects.get(correctObject.indirectObject);
    console.log(PRSI);
    countMoves();

    return {
      input: correctObject.objectInput,
      verb: correctSyntax.verb,
      prso: PRSO,
      prsi: PRSI,
      prsa: PRSA,
      locationObject: locationObject,
      finalLocation: hereObject.objFinalLocation,
    };
  }
};

export { evaluateInput, sortObjects };
