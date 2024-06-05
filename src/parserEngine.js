import { tell } from "./tell.js";
import { syntax, dictionary } from "./syntax.js";
import { objectWords, objects, localGlobals, rooms, user } from "./dungeon";
import { countMoves } from "./gClock";
import { globalObjects } from "./globals";

sortObjects = function (location) {
  const roomObjects = [];
  const combinedObjects = [
    ...Array.from(localGlobals.values()),
    ...Array.from(objects.values()),
  ];
  const getObjectsInLocation = function () {
    for (const object of objects.values()) {
      if (object.location.includes(location.name)) roomObjects.push(object);
    }
    if (location.hasOwnProperty("globals")) {
      location.globals.forEach((element) => roomObjects.push(element));
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
    const objectsLevel1 = Array.from(combinedObjects.values()).filter(
      (object) =>
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
const checkWords = function (dictionary, input) {
  const words = new Set([
    ...dictionary.objects,
    ...dictionary.rooms,
    ...dictionary.verbs,
    ...dictionary.prepositions,
    ...dictionary.movement,
  ]);
  return (wordNotInArray = input.split(" ").find((word) => !words.has(word)));
};

const objectHere = function (toCheck, objectsHere) {
  const objectsArray = [];
  const canSee = [];

  function seeInside(obj) {
    return (
      !obj.includes("invisible") &&
      (obj.includes("transBit") || obj.includes("openBit"))
    );
  }

  objectsHere.forEach((item) => {
    if (
      item.name === toCheck ||
      (item.synonym && item.synonym.includes(toCheck))
    )
      objectsArray.push(item);
  });
  function canSeeObject(location) {
    let currentContainedObject;
    let currentContainer;
    objectsArray.forEach((item) => {
      currentContainedObject = item;
      console.log("Inspecting object:", currentContainedObject);

      while (currentContainedObject.hasOwnProperty("location")) {
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

          canSee.push({
            obj: item,
            finalLocation: (function () {
              if (currentContainedObject.location === "localGlobals")
                return location.name;
              else return currentContainedObject.location;
            })(),
          });

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
  canSeeObject(rooms.get(`${user.get("location")}`));
  return canSee;
};

const checkObject = function (noun, objectWords, hereObject) {
  let object;
  let indirectObject;
  let objectInput;

  //see if object found by key is found in room based on search noun

  const objectIsHere = function (hereObject, object) {
    for (const item of hereObject) {
      if (item.obj.name === object) {
        return true;
      }
    }
    return false; // Return false if the object is not found
  };

  // finds unique item key based on noun
  function findKeyByItem(itemToFind) {
    for (const key in objectWords.globalObjects) {
      if (
        objectWords.globalObjects[key].includes(itemToFind) &&
        objectIsHere(hereObject, key)
      ) {
        return key;
      }
    }
    for (const key in objectWords.localGlobals) {
      if (
        objectWords.localGlobals[key].includes(itemToFind) &&
        objectIsHere(hereObject, key)
      ) {
        return key;
      }
    }
    for (const key in objectWords.objects) {
      if (
        objectWords.objects[key].includes(itemToFind) &&
        objectIsHere(hereObject, key)
      ) {
        return key;
      }
    }

    const allObjects = [
      objectWords.globalObjects,
      objectWords.localGlobals,
      objectWords.objects,
    ];

    for (const obj of allObjects) {
      for (const key in obj) {
        if (obj[key].includes(itemToFind)) {
          return key;
        }
      }
    }
    return null;
  }

  // adds object and indirect object unique key if exists
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

  const unknownWord = checkWords(dictionary, userInput);
  const correctSyntax = checkSyntax(syntax, userInput);
  const locationObject = sortObjects(rooms.get(`${user.get("location")}`));
  const hereObject = objectHere(
    correctSyntax?.object?.groups?.object,
    locationObject.combinedObjects
  );
  const correctObject = checkObject(
    correctSyntax.object,
    objectWords,
    hereObject
  );

  console.log(correctSyntax);
  console.log(correctObject);
  console.log(locationObject);
  console.log(hereObject);

  const exclusion = function (hereObject) {
    return hereObject.some((object) => object.obj.name === "globalwater");
  };

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
    tell("I do not undetstandd that");
  } else if (
    correctSyntax.isMatchFound &&
    correctSyntax.object.groups &&
    correctSyntax.object.groups.object.length &&
    correctObject.object &&
    !hereObject.length
  ) {
    tell(`There is no ${correctObject.objectInput} here!`);
  } else if (
    correctSyntax.isMatchFound &&
    correctSyntax.object.groups &&
    correctSyntax.object.groups.object.length &&
    correctObject.object &&
    hereObject.length > 1 &&
    !exclusion(hereObject)
  ) {
    tell(
      `Which ${correctSyntax.object.groups.object} do you mean, the ${hereObject[0].obj.desc} or the ${hereObject[1].obj.desc}?`
    );
  } else {
    //if match found true and only one object exists in location

    PRSA = correctSyntax.f_reference;
    PRSO =
      globalObjects.get(correctObject.object) ||
      localGlobals.get(correctObject.object) ||
      objects.get(correctObject.object);
    PRSI = objects.get(correctObject.indirectObject);
    console.log(correctObject.object);
    console.log(PRSI);
    console.log(PRSO);
    countMoves();

    return {
      input: correctObject.objectInput,
      verb: correctSyntax.verb,
      prso: PRSO,
      prsi: PRSI,
      prsa: PRSA,
      locationObject: locationObject,
      finalLocation: hereObject,
    };
  }
};

export { evaluateInput, sortObjects };
