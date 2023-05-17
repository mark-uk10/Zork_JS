
  import { evaluateInput } from "./parserEngine";
  import { tell } from "./tell.js";
  import { perform } from "./perform";
  
    const startPlay = () => {
    const inputElement = document.querySelector("#input");
  
    inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userInput = inputElement.value;
        tell(`>${userInput}`, "pre");
        const testSyntax = evaluateInput(userInput)
        if (testSyntax.verb != "stop"){
          perform(testSyntax.prso,testSyntax.prsa,testSyntax.prsi,testSyntax.verb)
        }
        inputElement.value = "";
      }
    });
  };
  
  startPlay();
  