
const input = document.getElementById("input");
const displayArea = document.getElementById("display");
var userInventory = [];
var userLocation = "kitchen";

function displayCommand(text, items) {
    let pText = document.createTextNode(text);
    let pCommand = document.createElement("p");
    if (items == null) {
        pCommand.appendChild(pText);
        pCommand.className = "command";
        displayArea.appendChild(pCommand);
    } else {
        pCommand.appendChild(pText);
        pCommand.className = "command";
        displayArea.appendChild(pCommand);
        pCommand.appendChild(items);
    }
}

function roomInterface(userCommands, lookCommand, moveCommands, movePreproposition, itemCommands, itemPrepropositionCommands) {

    const roomCollection = [
        {
            name: "kitchen",
            roomDescription: "you are standing in a small kitchen, there is a door leading to a corridor to the north",
            north: ["n", "corridor", true, "there is a door blocking your way", "you go north"],
            east: ["e", "null", false, "you cant walk through walls"],
            south: ["s", "null", false, "you cant walk throught walls"],
            west: ["w", "null", false, "you cant walk throught walls"]
            },
        {
            name: "corridor",
            roomDescription: "you are in a corridor, the kitchen is to the south, and there is a bedroom to the east",
            north: ["n", "null", false, "you cant walk through walls"],
            east: ["e", "bedroom", true, "the door is locked", "you go east"],
            south: ["s", "kitchen", true, "you cant walk throught walls", "you go south"],
            west: ["w", "null", false, "you cant walk through walls"]
            },
        {
            name: "bedroom",
            roomDescription: "you are in a corridor, the kitchen is to the south, and there is a bedroom to the east",
            north: ["n", "null", false, "you cant walk through walls"],
            east: ["e", "null", false, "you cant walk through walls"],
            south: ["s", "null", false, "you cant walk through walls"],
            west: ["w", "corridor", true, "you cant walk through walls", "you go west"]
            }];

    const itemCollection = [
            {
            name: "sack",
            inRoom: "kitchen",
            look: "On the table is an elongated brown sack, smelling of hot peppers",
            interact: "opening the brown sack reveals a clove of garlic",
            isVisible: true,
            contains: ["garlic"],
            inInventory: false,
            possibleInteract: ["get", "look", "open", "close"],
            isUsed: false,
            canSeeInside: false,
            },
            {
            name: "garlic",
            inRoom: ".",
            lookAT: "you see nothing special about the garlic",
            interact: "you eat the garlic, yuck!",
            isVisible: true,
            inContainer: "A clove of garlic",
            possibleInteract: ["look", "eat"]
            },
            {
            name: "bottle",
            inRoom: "kitchen",
            look: "A bottle is sitting on the table",
            interact: "you open the bottle",
            isVisible: true,
            contains: ["water"],
            inInventory: false,
            possibleInteract: ["get", "look", "fill"],
            isUsed: false,
            canSeeInside: true,
            },
            {
            name: "water",
            inContainer:"A quanity of water",
            inRoom: ".",
            lookAT: "you see nothing special about the water",
            interact: "you drink the water",
            isVisible: true,
            possibleInteract: ["look", "drink"]
            }];

    var roomCommands = {
        moveCommands: moveCommands,
        movePreproposition: movePreproposition,
        lookCommand: lookCommand,
        itemCommand: itemCommands,
        itemPreproposition: itemPrepropositionCommands,
        moveCharacterTo: function () {

            userCommands.forEach(function (element, index) {
                return getCharacter = userCommands[index].charAt(0);
            });

            let roomLocation = checkLocation();

            function movement(direction, roomValue) {
                if (direction == "n") return roomCollection[roomLocation].north[roomValue];
                else if (direction == "e") return roomCollection[roomLocation].east[roomValue];
                else if (direction == "s") return direction = roomCollection[roomLocation].south[roomValue];
                else if (direction == "w") return direction = roomCollection[roomLocation].west[roomValue];
            }

            function displayMove(direction) {
                movement(direction, 2) ? (displayCommand(movement(direction, 4)), userLocation = (movement(direction, 1))) :
                    displayCommand(movement(direction, 3));
            }

            if (movement("n", 0).includes(getCharacter)) displayMove("n");
            else if (movement("e", 0).includes(getCharacter)) displayMove("e");
            else if (movement("s", 0).includes(getCharacter)) displayMove("s");
            else if (movement("w", 0).includes(getCharacter)) displayMove("w");

        },
        lookAround: function () {
            let itemUl = document.createElement("ul");
            

            var location = roomCollection[checkLocation()].name;

            for (let i = 0; i < itemCollection.length; i++) {
                var itemList = document.createElement("li");
                let insideUl = document.createElement("ul");
                insideUl.className = "insideUL";
                var insideList = document.createElement("li");
                if ((location == itemCollection[i].inRoom) && (itemCollection[i].isVisible === true)) {
                    itemList.innerHTML = (itemCollection[i].look);
                    itemUl.appendChild(itemList);
                    if (itemCollection[i].hasOwnProperty("contains") != true || itemCollection[i].canSeeInside == false){}
                    else if (itemCollection[i].contains.length >0 && itemCollection[i].canSeeInside == true)
                        {
                            let display = document.createElement("li");
                            display.innerHTML = ("The " + itemCollection[i].name + " contains:");
                            insideUl.appendChild(display);
                            itemCollection[i].contains.forEach(function (element, index) {
                                
                                for (let i = 0; i < itemCollection.length; i++)
                                    {
                                        if (itemCollection[i].name == element){
                                            let itemList = document.createElement("li");
                                                itemList.innerHTML = (itemCollection[i].inContainer);
                                                insideUl.appendChild(itemList);
                                        }
                                        
                                    }
                            });
                            itemUl.append(insideUl);
                        }
                    else
                        {
                            let display = document.createElement("li");
                            display.innerHTML = ("The " + itemCollection[i].name + " is empty");
                            insideUl.appendChild(display);
                            insideUl.className = "insideUL";
                            itemUl.append(insideUl);
                        }
                }
            }
            displayCommand(roomCollection[checkLocation()].roomDescription, itemUl);
        },

        confirmMove: function () {
            displayCommand("where do you want to " + userCommands[0] + "?");
        }
    }

    function checkLocation() {
        for (let i = 0; i < roomCollection.length; i++) {
            if (userLocation == roomCollection[i].name) return i;
        }
    }

    function uCommands(length) {
        let one = userCommands[0];
        let two = userCommands[1];
        let three = userCommands[2];
        let commandLength = {
            1: function () {
                if (roomCommands.lookCommand.includes(one))
                    roomCommands.lookAround();
                else if (roomCommands.moveCommands.includes(one))
                    roomCommands.moveCharacterTo();
                else if (roomCommands.movePreproposition.includes(one))
                    roomCommands.confirmMove();
            },
            2: function () {
                if (roomCommands.movePreproposition.includes(one) && roomCommands.moveCommands.includes(two))
                    roomCommands.moveCharacterTo();
                else
                    displayCommand("you have used " + one + " in a way i dont understand");
            }
        };
        return commandLength[userCommands.length]();
    }
    
    let command = uCommands();
}

function isCommandValid(userCommands, validUserInputs, commandList) {
    /*checks commands, if its an interce command run here with function in check commands, if its not an interface command it is valid but it must be a room command we need to check the rooms -SEE NOTE 3-*/

    function checkInterfaceCommand(commandListIndex) {
        if (commandList[commandListIndex].interfaceCommand.includes(userCommands[0])) {
            userCommands.length == 1 ? displayCommand(commandList[commandListIndex].display) :
                displayCommand("you have used " + userCommands[0] + " in a way I dont understand");
        }
    }

    for (var i = 0; i < commandList.length; i++) {
        i < 4 ? checkInterfaceCommand(i) : commandList[4].collect();
    }
}

function checkCommands(userCommands) {

    //A comman list object array of usable commands
    var commandList = [
        {
            interfaceCommand: ["about", "info"],
            display: "adventure game test room with one room to escape from. copywrite: Mark Ikin 2020"
        },
        {
            interfaceCommand: ["commands", "help"],
            display: "here is some useful information about the game and commands"
        },
        {
            interfaceCommand: ["save"],
            display: "One day this wil work and you will be able to save your game"
        },
        {
            interfaceCommand: ["load", "restore"],
            display: "One day this wil work and you will be able to load your game,and it will be amazing"
        },
        {
            interfaceCommand: ["look", "l", "north", "east", "south", "west", "n", "e", "s", "w", "walk", "go", "run", "get", "look", "at"],

            collect: function () {
                var lookCommands = this.interfaceCommand.slice(0, 2);
                var moveCommands = this.interfaceCommand.slice(2, 10);
                var movePreproposition = this.interfaceCommand.slice(10, 13);
                var itemCommands = this.interfaceCommand.slice(13, 15);
                var itemPrepropositionCommands = this.interfaceCommand.slice(15, 16);

                if (this.interfaceCommand.includes(userCommands[0]))
                    roomInterface(userCommands, lookCommands, moveCommands, movePreproposition, itemCommands, itemPrepropositionCommands);
            }
        }];

    function findCommands() {
        var interfaceCommandsArray = [];
        var wrongCommandsArray = [];

        // pushes all usable commands to command array
        for (var i = 0; i < commandList.length; i++) {
            var interfaceCommands = commandList[i].interfaceCommand;
            for (var x = 0; x < interfaceCommands.length; x++) {
                interfaceCommandsArray.push(interfaceCommands[x]);
            }
        }

        //        console.log(userCommands);
        //        console.log(interfaceCommandsArray);

        /*filters out all commands that are not in the user commandsarray to an array wrong commands*/
        wrongCommandsArray = userCommands.filter(function (wc) {
            return interfaceCommandsArray.indexOf(wc) < 0;
        });

        /*if there are any words in the wrong commands array the user must have typed in a wrong commandd somewhere and thus we display the wrong first command as per Zork -SEE NOTE 1-*/
        wrongCommandsArray.length > 0 ? displayCommand("I don\'t know the word \xa0" + '"' + wrongCommandsArray[0] + '"' + ".") :
            isCommandValid(userCommands, interfaceCommandsArray, commandList);
    }
    findCommands();
}

/*gets user input and put it in managable array, removed all empty elements and puts elements in lower case and display user input*/
function getUserInput(event) {
    var key = event.keyCode;
    var userInput;
    var commandTrim;
    var commandLower;
    var commandArray = [];
    var filterd;

    var pUserInput = document.createElement("p");
    pUserInput.className = "userInput";

    //used to remove empty elements from commandarray
    function removeEmpty(element) {
        if (element != '') return element;
    }

    //makes sure there are not too many P childs in display area
    function deleteInput(current = displayArea.childElementCount, max = 50) {

        if (current > max) {
            /*deletes twice as we add twice -SEE NOTE 2-*/
            displayArea.removeChild(displayArea.firstChild);
            displayArea.removeChild(displayArea.firstChild);
        }
        console.log(" current " + current + " max nodes " + max);
    }

    /*checks command for usable verbs/nouns this will be used as the main function to check for usable commands*/
    function checkIsEmpty() {
        filterd.length === 0 ? displayCommand("Pardon!") : checkCommands(filterd);
    }
    /////////////////////////////////////////////////////////

    /*sets margin bottom when first input activted. only for presentaton consitency*/
    var setStartElement = (function () {
        var executed = false;
        return function () {
            if (!executed) {
                executed = true;
                var i = document.getElementsByClassName("userInput");
                i[0].style.marginBottom = "20px";
            }
        };
    })();

    if (key === 13) {
        setStartElement();

        event.preventDefault();
        userInput = input.value;
        commandTrim = userInput.trim();
        commandLower = commandTrim.toLowerCase();
        commandArray = commandLower.split(" ");
        filterd = commandArray.filter(removeEmpty);
        pUserInput.append("\x3e" + "\xa0\xa0" + userInput);
        displayArea.append(pUserInput);

        checkIsEmpty();
        input.value = "";
        deleteInput();

    }
}
input.addEventListener("keydown", getUserInput);