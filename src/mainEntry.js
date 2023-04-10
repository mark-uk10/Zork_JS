const displayText = (input, elementToMake) => {
    const displayArea = document.querySelector(".displayArea");
    const element = document.createElement(elementToMake);
    element.textContent = input;
    displayArea.appendChild(element);
  };
  const evaluateInput = function (input) {
    const words = input.trim().toLowerCase().split(" ").filter((word) => word.length > 0 && /^[a-zA-Z]*$/.test(word));
  };
  
  const startPlay = () => {
    const inputElement = document.querySelector("input");
  
    inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const userInput = inputElement.value;
        displayText(`>${userInput}`, "pre");
        evaluateInput(userInput);
        inputElement.value = "";
      }
    });
  };
  
  startPlay();
  