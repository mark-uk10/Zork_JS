function fSet(object, flagToSet) {
  object.flags.push(flagToSet);
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
function isInInv(itemName) {
  return items.some((item) => item.name === itemName);
}

function setG(thing, bool) {
  Global[thing] = bool;
}

function pickOne(list) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
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

const gExitFlags = {
  CYCLOPSFLAG: [],
  LOWTIDE: ["corridor"],
};

const Global = {
  rugMoved: false,
  verbose: false,
  superBrief: false,
};

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
