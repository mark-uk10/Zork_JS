const gExitFlags = {
  CYCLOPSFLAG: [],
  LOWTIDE: ["corridor"],
};

const Global = {
  rugMoved: false,
  verbose: false,
  superBrief: false,
  yucksArray: [],
};

function fSet(object, flagToSet) {
  if (!object.flags.includes(flagToSet)) {
    object.flags.push(flagToSet);
  }
}
function fClear(object, flagToClear) {
  const index = object.flags.indexOf(flagToClear);
  object.flags.splice(index, 1);
}
function fIsSet(object, flagToCheck) {
  if (Array.isArray(object)) {
    return object.includes(flagToCheck);
  } else if (typeof object === "object") {
    return object.flags.includes(flagToCheck);
  }
}
function isInInv(itemName, invList) {
  return invList.some((item) => item.name === itemName);
}

function setG(thing, bool) {
  Global[thing] = bool;
}

function pickOne(fixedArray) {
  function resetRandomArray(fixedArray) {
    Global.yucksArray = [...fixedArray];
    Global.yucksArray = Global.yucksArray.sort(() => Math.random() - 0.5);
  }
  if (Global.yucksArray.length === 0) {
    resetRandomArray(fixedArray);
  }
  const randomIndex = Math.floor(Math.random() * Global.yucksArray.length);
  const removedItem = Global.yucksArray.splice(randomIndex, 1);
  return removedItem;
}

const globalObjects = new Map();

globalObjects.set("floor", {
  location: "globalObjects",
  name: "floor",
  desc: "floor",
  flags: ["noDescBit"],
});
globalObjects.set("me", {
  location: "globalObjects",
  name: "me",
  desc: "you",
  flags: ["actorBit"],
  synonym: ["me", "myself", "self", "cretin"],
  flags: ["noDescBit"],
});

function getGFlags(location, searchFlag) {
  return function () {
    const flagInfo = {
      location: location,
      searchFlag: searchFlag,
    };
    console.log(flagInfo);

    // Check if the location and searchFlag match any entries in gFlags
    const flagKeyArray = gExitFlags[flagInfo.searchFlag];
    const isFlagPresent =
      flagKeyArray && flagKeyArray.includes(flagInfo.location);
    console.log(isFlagPresent);
    return isFlagPresent;
  };
}

export {
  globalObjects,
  gExitFlags,
  getGFlags,
  Global,
  notHereObject,
  fSet,
  setG,
  fClear,
  fIsSet,
  multiObject,
  waiting,
  pickOne,
  isInInv,
};
