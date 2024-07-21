// prettier-ignore
const dictionary = {
  objects: ["door", "wooden", "woodendoor", "water", "globalwater", "quantity","bag",
  "bottle","table","lunch","garlic","leaflet", "booklet", "mail","picture",
  "trap", "cover", "door", "trap-door", "trapdoor","rug","carpet","floor",
  "me", "myself", "self", "cretin", "pair", "hands", "hand",
  "lungs", "air", "mouth", "breath"],
  rooms: ["kitchen","corridor","forest","livingroom","cellar"],
  verbs: ["i","inv","inventory","save","load","verbose","brief","superbrief",
    "move", "take","get","pickup","hold","carry","grab","catch",
    "eat","consume","taste","bite","drink","swallow","imbibe","open","close","shut",
    "back","blast","blowup","bug","chomp","lose","barf","brush","clean",
    "drop","putdown","leave","follow","persue","chase","come","frobozz","hatch",
    "make","plug","glue","patch","repair","fix",
    "look","l","stare","gaze","with","in","under","behind","with",
    "pour","spill","blow","put","examine","find","search","seek","see"],
  prepositions: [
    "the","at","in","from","on","under","inside","behind","around",
    "with","under","global","into","for","where"],
  movement: ["n","e","s","w","d","north","east","south","west","up","down"],
};

const reg = function (expression) {
  return new RegExp(`^${expression}$`);
};

const synonyms = {
  invenory: ["i", "inv", "inventory"],
};

const syntax = [
  {
    traversalSyntax: {
      north: reg(`(north|n)`),
      east: reg(`(east|e)`),
      south: reg(`(south|s)`),
      west: reg(`(west|w)`),
      down: reg(`(down|d)`),
      up: reg(`(up|u)`),
      f_reference: "f_traversal",
    },
  },
  {
    inventorySyntax: {
      inventory: reg(`(i|inv|inventory)`),
      f_reference: "f_inventory",
    },
  },
  {
    saveSyntax: {
      save: reg(`save`),
      f_reference: "f_save",
    },
  },
  {
    loadSyntax: {
      load: reg(`load`),
      f_reference: "f_load",
    },
  },
  {
    verbosity: {
      verbose: reg(`verbose`),
      brief: reg(`brief`),
      superBrief: reg(`superbrief`),
      f_reference: `f_verbosity`,
    },
  },
  {
    moveSyntax: {
      move: reg(`move(?<object>.*)`),
      f_reference: "f_move",
    },
  },
  {
    takeSyntax: {
      waiting: reg(`(take|get|pickup|hold|carry|grab|catch)(the)?`),
      take: reg(`(take|get|pickup|hold|carry|grab|catch)(the)?(?<object>.*)`),
      f_reference: "f_take",
    },
  },
  {
    eatSyntax: {
      waiting: reg(`(eat|consume|taste|bite)(the)?`),
      eat: reg(`(eat|consume|taste|bite)(the)?(?<object>.*)`),
      f_reference: "f_eat",
    },
  },
  {
    drinkSyntax: {
      waiting: reg(`(drink|swallow|imbibe)(the)?`),
      drink: reg(`(drink|swallow|imbibe)(the)?(?<object>.*)`),
      f_reference: "f_drink",
    },
  },
  {
    openSyntax: {
      waiting: reg(`open`),
      open: reg(`open(up)?(the)?(?<object>.*)`),
      f_reference: "f_open",
    },
  },
  {
    closeSyntax: {
      waiting: reg(`close`),
      close: reg(`(close|shut)(the)?(?<object>.*)`),
      f_reference: "f_close",
    },
  },
  {
    backSyntax: {
      back: reg(`back`),
      f_reference: "f_back",
    },
  },
  {
    blastSyntax: {
      blast: reg(`blast`),
      blowUp: reg(`blowup(the)?(?<object>.*)`),
      f_reference: "f_blast",
    },
  },
  {
    bugSyntax: {
      blast: reg(`bug`),
      f_reference: "f_bug",
    },
  },
  {
    chompSyntax: {
      blast: reg(`(chomp|lose|barf)`),
      f_reference: "f_chomp",
    },
  },
  {
    brushSyntax: {
      waiting: reg(`brush`),
      brushWith: reg(
        `(brush|clean)(?<object>.*)with(the)?(?<indirectObject>.*)`
      ),
      brush: reg(`(brush|clean)(the)?(?<object>.*)`),
      f_reference: "f_brush",
    },
  },
  {
    dropSyntax: {
      waiting: reg(`(drop|putdown|leave)(the)?`),
      drop: reg(`(drop|putdown|leave)(the)?(?<object>.*)`),
      f_reference: "f_drop",
    },
  },
  {
    followSyntax: {
      follow: reg(`(follow|persue|chase|come)`),
      followThe: reg(`(follow|persue|chase|come)(the)?(?<object>.*)`),
      f_reference: "f_follow",
    },
  },
  {
    froboz: {
      frobozz: reg(`frobozz`),
      f_reference: "f_frobozz",
    },
  },
  {
    hatch: {
      hatch: reg(`hatch`),
      hatchWith: reg(`hatch(the)?(?<object>.*)`),
      f_reference: "f_hatch",
    },
  },
  {
    make: {
      waiting: reg(`make`),
      makeWith: reg(`make(the)?(?<object>.*)`),
      f_reference: "f_make",
    },
  },
  {
    plug: {
      waiting: reg(`plug`),
      plugWith: reg(
        `(plug|glue|patch|repair|fix)(the)?(?<object>.*)with(the)?(?<indirectObject>.*)`
      ),
      plug: reg(`(plug|glue|patch|repair|fix)(the)?(?<object>.*)`),
      f_reference: "f_plug",
    },
  },

  ///////////////////LOOK VERBS///////////////////
  {
    lookSyntax: {
      look: reg(`(look|l|stare|gaze)(around)?(up)?(down)?`),
      lookAround: reg(`(look|l|stare|gaze)around(?<object>.*)`),
      lookUp: reg(`(look|l|stare|gaze)up(?<object>.*)`),
      lookDown: reg(`(look|l|stare|gaze)down(?<object>.*)`),
      f_reference: "f_look",
    },
    lookAtSyntax: {
      waiting: reg(`(look|l|stare|gaze)at`),
      lookAt: reg(`(look|l|stare|gaze)at(the)?(?<object>.*)`),
      examine: reg(`examine(?<object>.*)`),
      f_reference: "f_examine",
    },
    lookOnSyntax: {
      lookOn: reg(`(look|l|stare|gaze)on(?<object>.*)`),
      f_reference: "f_lookOn",
    },
    lookUnderSyntax: {
      lookUnder: reg(`(look|l|stare|gaze)under(?<object>.*)`),
      f_reference: "f_lookUnder",
    },
    lookBehindSyntax: {
      lookBehind: reg(`(look|l|stare|gaze)behind(?<object>.*)`),
      f_reference: "f_lookBehind",
    },
    lookInsideSyntax: {
      lookInside: reg(`(look|l|stare|gaze)inside(?<object>.*)`),
      lookIn: reg(`(look|l|stare|gaze)in(?<object>.*)`),
      lookWith: reg(`(look|l|stare|gaze)with(?<object>.*)`),
      f_reference: "f_lookInside",
    },
    LookForSyntax: {
      lookFor: reg(
        `(lookfor|find|searchfor|where|seek|see)(the)?(?<object>.*)`
      ),
      f_reference: "f_find",
    },
    searchSyntax: {
      searchFor: reg(`search(in)?(?<object>.*)`),
      f_reference: "f_search",
    },

    ////////////////////end of look verbs ///////////////////////

    putInSyntax: {
      waiting: reg(`(put)`),
      putIn: reg(`(put)(?<object>.*)in(?<indirectObject>.*)`),
      f_reference: "f_putIn",
    },
  },
  {
    pourSyntax: {
      pourIn: /^(pour|spill)(?<object>.*)in(?<indirectObject>.*)$/,
      pourFrom: /^(pour|spill)(?<object>.*)from(?<indirectObject>.*)$/,
      pour: /^(pour|spill)(?<object>.*)$/,
      f_reference: "f_pour",
    },
    pourOnSyntax: {
      pourOn: /^pour(?<object>.*)on(?<indirectObject>.*)$/,
      f_reference: "f_pourOn",
    },
  },
  {
    onlyObject: {
      error: /^(?<object>.*)$/,
      f_reference: "f_error",
    },
  },
];

export { syntax, dictionary };
