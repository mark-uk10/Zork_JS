import { tell } from "./tell.js";

const evaluateInput = function (input) {
    
    if (input){
        const words = input.trim().toLowerCase().split(" ").filter(element => {
          return Boolean(element.trim());
        });
  console.log(words)
    }
    
  };

  export{evaluateInput}