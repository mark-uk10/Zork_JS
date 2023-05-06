import { tell } from "./tell.js";
import { syntax } from "./syntax.js";
import { collectVerbs } from './syntax.js';


const objects = {
  words: ["water","bottle"]
}

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
  
  syntax.some(element => {
    for (const key in element) {
      for (const nestedKey in element[key]) {
        if (key !== "synonym" && key !== "words") {
          const value = element[key][nestedKey];
          if (typeof value !== 'string' && typeof value !== 'function') {
            const test = value.exec(userInputNoSpace);
            if (test) {
              const name = value[key];
              functionReference = element[key].f_reference;
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
    f_reference: functionReference,
    isMatchFound: isMatchFound // indicate whether a match was found or not
  };
};

const evaluateInput = function (input) {

    let PRSA  //verb
    let PRSO 
    let PRSI 
    let userInput = input.trim().toLowerCase();
    const unknownWords = checkWords(collectVerbs(),userInput)
    const correctSyntax = checkSyntax(syntax,userInput)
    const correctObject = checkObject(correctSyntax.object,objects.words)
    console.log(correctSyntax)
    console.log(correctObject)

    if(!userInput){
      tell("I beg your pardon?")
    }
    else if(unknownWords.length>0){
      tell(`I don't know the word ${unknownWords[0]}`)
    }
    else if(correctSyntax.isMatchFound == true){
      PRSA = correctSyntax.f_reference
      console.log(PRSA)
      if (correctObject.object == false || correctObject.indirectObject == false){
        console.log("dont know")
      }
      if (correctObject.object == true){
        PRSO = correctSyntax.object.groups.object
      }
      if (correctObject.indirectObject == true){
        PRSI = correctSyntax.object.groups.indirectObject
      }
        
        console.log(PRSO)
        console.log(PRSI)
      
    }
  };

  export{evaluateInput}