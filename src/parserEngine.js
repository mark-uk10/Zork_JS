import { tell } from "./tell.js";
import { syntax, collectVerbs } from "./syntax.js";
import { objectWords} from "./dungeon";

const checkWords = function(verbs,input){
  inputArray = input.split(" ")
  const wordsNotInArray = inputArray.filter(word => !verbs.has(word)).filter(word => word.length > 0);

  return wordsNotInArray
}

const checkObject = function(noun,objects){
  let object;
  let indirectObject;

    if(noun?.groups?.object)
      objects.includes(noun.groups.object) ? object = true : object = false
    if(noun?.groups?.indirectObject)
      objects.includes(noun.groups.indirectObject) ? indirectObject = true :  indirectObject = false
  return{
    object:object,
    indirectObject:indirectObject,
  }
}

const checkSyntax = function(syntax, input) {
  userInputNoSpace = input.replace(/ /g,'');
  let result = false;
  let functionReference = "";
  let isMatchFound = false;
  let verb;
  
  syntax.some(element => {
    for (const key in element) {
      for (const nestedKey in element[key]) {
        if (key !== "synonym" && key !== "words") {
          const value = element[key][nestedKey];
          if (typeof value !== 'string' && typeof value !== 'function') {
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
    isMatchFound: isMatchFound // indicate whether a match was found or not
  };
};

const evaluateInput = function (input) {

    let PRSA  //verb
    let PRSO 
    let PRSI
    let go = true;
    let userInput = input.trim().toLowerCase();
    const unknownWords = checkWords(collectVerbs(),userInput)
    const correctSyntax = checkSyntax(syntax,userInput)
    const correctObject = checkObject(correctSyntax.object,objectWords)

    if(!userInput){
      tell("I beg your pardon?")
      go = false;
    }
    else if(unknownWords.length>0){
      tell(`I don't know the word ${unknownWords[0]}`)
      go = false;
    }
    else if(correctSyntax.isMatchFound == true){
      PRSA = correctSyntax.f_reference
      if (correctObject.object == false || correctObject.indirectObject == false){
        tell(`I don't understand that sentence`)
        go = false;
      }
      if (correctObject.object == true){
        PRSO = correctSyntax.object.groups.object
      }
      if (correctObject.indirectObject == true){
        PRSI = correctSyntax.object.groups.indirectObject
      }
    }

    if (go)
      return {
        verb:correctSyntax.verb,
        prso:PRSO,
        prsi:PRSI,
        prsa:PRSA,
      }
    else
      return{
        verb:"stop"
      }
  };

  export{evaluateInput}