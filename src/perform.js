import { verbRoutines } from "./verbs";
import { objects, rooms, user } from "./dungeon";
import { sortObjects } from "./parserEngine";

const perform = function (
  object,
  indObject,
  reference,
  verb,
  input,
  levels,
  finalLocation
) {
  const objectDef = object;
  const indObjectDef = indObject;
  const location = rooms.get(`${user.get("location")}`);
  const verbRoutine = verbRoutines.get(`${reference}`);

  if (reference === "f_look") verbRoutine.look(location, levels);
  if (reference === "f_save") verbRoutine.save(objects);
  if (reference === "f_load") verbRoutine.load(objects);
  if (reference === "f_examine") verbRoutine.examine(objectDef, levels);
  if (reference === "f_move") verbRoutine.move(objectDef, objects);
  if (reference === "f_inventory") verbRoutine.inventory(levels.invObjects);
  if (reference === `f_verbosity`) {
    if (verb === "verbose") verbRoutine.verbose();
    else if (verb === "brief") verbRoutine.brief();
    else verbRoutine.superBrief();
  }
  if (reference === "f_take")
    verbRoutine.preTake(objectDef, objects.get(`${objectDef.location}`));
  if (reference === "f_eat")
    verbRoutine.eat(objectDef, levels.invObjects.combinedInv);
  if (reference === "f_drink")
    verbRoutine.drink(objectDef, levels.invObjects.combinedInv);
  if (reference === "f_drop") {
    console.log(finalLocation);
    verbRoutine.preDrop({
      obj: objectDef,
      loc: objects.get(`${objectDef.location}`),
      finalLoc: finalLocation[0].finalLocation,
      userLoc: user.get("location"),
    });
  }
  if (reference === "f_back") {
    verbRoutine.back();
  }
  if (reference === "f_blast") {
    verbRoutine.blast(objectDef);
  }
  if (reference === "f_brush") {
    verbRoutine.brush(objectDef, indObjectDef);
  }
  if (reference === "f_bug") {
    verbRoutine.bug();
  }
  if (reference === "f_chomp") {
    verbRoutine.chomp();
  }
  if (reference === "f_follow") {
    verbRoutine.follow();
  }
  if (reference === "f_frobozz") {
    verbRoutine.frobozz();
  }
  if (reference === "f_hatch") {
    verbRoutine.hatch();
  }
  if (reference === "f_lookUnder") {
    verbRoutine.lookUnder();
  }
  if (reference === "f_make") {
    verbRoutine.make();
  }
  if (reference === "f_plug") {
    verbRoutine.plug();
  }
  if (reference === "f_open") {
    verbRoutine.open(objectDef, levels.combinedObjects);
  }
  if (reference === "f_close") {
    verbRoutine.close(objectDef);
  }
  if (reference === "f_traversal") {
    function getDirection(verb) {
      const directions = ["north", "east", "south", "west", "down", "up"];
      if (directions.includes(verb)) return verb;
      else return false;
    }

    const direction = getDirection(verb);
    const canMove = verbRoutine.tryMove(direction, location);

    if (canMove) {
      const newLocationName = verbRoutine.moveAndLook(canMove);
      const newLocation = rooms.get(newLocationName);
      const newObjects = sortObjects(newLocation);
      verbRoutines.get("f_look").firstLook(newLocation, newObjects);
    }
  }
};

export { perform };
