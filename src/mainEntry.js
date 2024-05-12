import { evaluateInput } from "./parserEngine";
import { tell } from "./tell.js";
import { perform } from "./perform";

const startPlay = () => {
  const inputElement = document.querySelector("#input");

  inputElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const userInput = inputElement.value;
      tell(`>${userInput}`, "pre");
      const testSyntax = evaluateInput(userInput);
      console.log(testSyntax);
      if (testSyntax) {
        perform(
          testSyntax.prso,
          testSyntax.prsi,
          testSyntax.prsa,
          testSyntax.verb,
          testSyntax.input,
          testSyntax.locationObject,
          testSyntax.finalLocation
        );
      }
      inputElement.value = "";
    }
  });
};

startPlay();
