import { objectWords, roomWords } from "./dungeon";

const words = {
  lookSynonym: "(look|l|stare|gaze)",
  pourSynonym: "(pour|spill)",
  takeSynonym: "(take|get|pickup|hold|carry|grab|catch)",
  dropSynonym: "(drop|putdown|leave)",
  inventory: "(i|inv|inventory)",
  brush: "(brush|clean)",
  chomp: "(chomp|lose|barf)",
  follow: "(follow|persue|chase|come)",
  plug: "(plug|glue|patch|repair|fix)",
  close: "(close|shut)",
  eat: "(eat|consume|taste|bite)",
  drink: "(drink|swallow|imbibe)",
  prepositions: [
    "the",
    "at",
    "in",
    "from",
    "on",
    "under",
    "inside",
    "behind",
    "around",
    "with",
    "floor",
    "blow",
    "bug",
    "hatch",
    "under",
    "global",
    "wooden",
  ],
  movement: [
    "n",
    "e",
    "s",
    "w",
    "d",
    "north",
    "east",
    "south",
    "west",
    "up",
    "down",
    "make",
  ],
  objects: objectWords,
  rooms: roomWords,
  getSynonyms() {
    function collectWords(syn) {
      return syn.match(/\b\w+\b/g).filter((word) => !/[\(\)\|]/.test(word));
    }
    const lookSynonyms = collectWords(this.lookSynonym);
    const pourSynonyms = collectWords(this.pourSynonym);
    const takeSynonyms = collectWords(this.takeSynonym);
    const dropSynonyms = collectWords(this.dropSynonym);
    const invSynonyms = collectWords(this.inventory);
    const brushSynonyms = collectWords(this.brush);
    const chompSynonyms = collectWords(this.chomp);
    const follow = collectWords(this.follow);
    const plug = collectWords(this.plug);
    const eat = collectWords(this.eat);
    const drink = collectWords(this.drink);
    return [
      ...lookSynonyms,
      ...pourSynonyms,
      ...takeSynonyms,
      ...dropSynonyms,
      ...invSynonyms,
      ...brushSynonyms,
      ...chompSynonyms,
      ...follow,
      ...plug,
      ...eat,
    ];
  },
  getVerbs(syntax) {
    let verbs = [];
    syntax.forEach((syntaxObj) => {
      Object.entries(syntaxObj).forEach(([key, value]) => {
        if (key !== "traversalSyntax") {
          Object.keys(value).forEach((subKey) => {
            if (subKey !== "f_reference" && subKey !== "error") {
              verbs.push(subKey.toLowerCase());
            }
          });
        }
      });
    });
    return verbs;
  },
};

const reg = function (expression) {
  return new RegExp(`^${expression}$`);
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
      inventory: reg(`${words.inventory}`),
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
      waiting: reg(`${words.takeSynonym}(the)?`),
      take: reg(`${words.takeSynonym}(the)?(?<object>.*)`),
      f_reference: "f_take",
    },
  },
  {
    eatSyntax: {
      waiting: reg(`${words.eat}(the)?`),
      eat: reg(`${words.eat}(the)?(?<object>.*)`),
      f_reference: "f_eat",
    },
  },
  {
    drinkSyntax: {
      waiting: reg(`${words.drink}(the)?`),
      drink: reg(`${words.drink}(the)?(?<object>.*)`),
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
      close: reg(`${words.close}(the)?(?<object>.*)`),
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
      blast: reg(`${words.chomp}`),
      f_reference: "f_chomp",
    },
  },
  {
    brushSyntax: {
      waiting: reg(`brush`),
      brushWith: reg(
        `${words.brush}(?<object>.*)with(the)?(?<indirectObject>.*)`
      ),
      brush: reg(`${words.brush}(the)?(?<object>.*)`),
      f_reference: "f_brush",
    },
  },
  {
    dropSyntax: {
      waiting: reg(`${words.dropSynonym}(the)?`),
      drop: reg(`${words.dropSynonym}(the)?(?<object>.*)`),
      f_reference: "f_drop",
    },
  },
  {
    followSyntax: {
      follow: reg(`${words.follow}`),
      followThe: reg(`${words.follow}(the)?(?<object>.*)`),
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
    lookUnder: {
      waiting: reg(`lookunder`),
      lookUnderWith: reg(`lookunder(the)?(?<object>.*)`),
      f_reference: "f_lookUnder",
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
        `${words.plug}(the)?(?<object>.*)with(the)?(?<indirectObject>.*)`
      ),
      plug: reg(`${words.plug}(the)?(?<object>.*)`),
      f_reference: "f_plug",
    },
  },
  {
    lookSyntax: {
      look: reg(`look`),
      lookAround: reg(`${words.lookSynonym}around(?<object>.*)`),
      lookUp: reg(`${words.lookSynonym}up(?<object>.*)`),
      lookDown: reg(`${words.lookSynonym}down(?<object>.*)`),
      f_reference: "f_look",
    },
    lookAtSyntax: {
      waiting: reg(`${words.lookSynonym}at`),
      lookAt: reg(`${words.lookSynonym}at(the)?(?<object>.*)`),
      f_reference: "f_examine",
    },
    lookOnSyntax: {
      lookOn: reg(`${words.lookSynonym}on(?<object>.*)`),
      f_reference: "f_lookOn",
    },
    lookInSyntax: {
      waiting: reg(`lookwith|lookin`),
      lookWith: /^lookwith(?<object>.*)$/,
      lookIn: /^lookin(?<object>.*)$/,
      f_reference: "f_lookInside",
    },
    lookUnderSyntax: {
      lookUnder: /^lookunder(?<object>.*)$/,
      f_reference: "f_lookUnder",
    },
    lookBehindSyntax: {
      lookBehind: /^lookbehind(?<object>.*)$/,
      f_reference: "f_lookBehind",
    },
    lookForSyntax: {
      find: /^lookfor(?<object>.*)$/,
      f_reference: "f_find",
    },
  },
  {
    pourSyntax: {
      pourIn: /^pour(?<object>.*)in(?<indirectObject>.*)$/,
      pourFrom: /^pour(?<object>.*)from(?<indirectObject>.*)$/,
      pour: /^pour(?<object>.*)$/,
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

const collectWords = () => {
  const objectWords = new Set(Object.values(words.objects).flat());
  const synonymsSet = new Set([
    ...words.getSynonyms(),
    ...words.getVerbs(syntax),
    ...words.prepositions,
    ...words.movement,
    ...objectWords,
    ...words.rooms,
  ]);
  return synonymsSet;
};

const verbs = words.getVerbs(syntax);

export { syntax, collectWords, verbs };
