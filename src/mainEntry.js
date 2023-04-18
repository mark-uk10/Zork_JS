
  import { evaluateInput } from "./parserEngine";
  import { tell } from "./tell.js";
  
    const startPlay = () => {
    const inputElement = document.querySelector("#input");
  
    inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userInput = inputElement.value;
        tell(`>${userInput}`, "pre");
        evaluateInput(userInput);
        inputElement.value = "";
      }
    });
  };
  
  startPlay();
  