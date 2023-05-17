const tell = (input, elementToMake, addOn) => {
    const displayArea = document.querySelector("#display");
    const element = document.createElement(elementToMake);
    element.textContent = (`${input}`);
    displayArea.appendChild(element);
  };

  export{tell}
