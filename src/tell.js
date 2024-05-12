const tellArray = [];

const tell = (input, elementToMake) => {
  const displayArea = document.querySelector("#display");
  const element = document.createElement(elementToMake);
  element.textContent = `${input}`;
  displayArea.appendChild(element);

  tellArray.push(input);
};

const sayArray = function () {
  tellArray.forEach((item) => {
    console.log(item);
  });
};
export { tell, sayArray };
