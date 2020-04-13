
const input = document.getElementById("input");
const displayArea = document.getElementById("display");
var userInventory = []; //the inventory the user has, items are added or removed
var userLocation = "kitchen"; //current user location using room name as key

// used to display on screen with items or not
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

//the main room interface function after we have checked command is valid
function roomInterface(userCommands, lookCommand, moveCommands, movePreproposition, itemCommands, itemPrepropositionCommands) {

    /*the collection of rooms for the game, each direction has a character to search in the user commands
    we also need to know where the direction goes to by room name key, we need to know if we can go that way, if we cant go that way
    we need to display why they cant and if they can go that way we can display text about what happens when they do.*/
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

    /*collection of items for game, each item has a name key, it may be in a room if its not in inventory, we use room name key,
    items can be looked at while in rooms, they have interact text, they may not be alaways visible, they may be containers and hold
    objects, they may be in inventory or not, they have possible interactions(look, open, etc), they may have been used or not 
    which can change decription. sometiems u can see inside an object e.g. a glass bottle or after the sack is open*/
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

    //room commands have been passed from the collect function, they are arrays
    var roomCommands = {
        moveCommands: moveCommands,
        movePreproposition: movePreproposition,
        lookCommand: lookCommand,
        itemCommand: itemCommands,
        itemPreproposition: itemPrepropositionCommands,
        // the main function to move character to different rooms
        moveCharacterTo: function () {

            userCommands.forEach(function (element, index) {
                return getCharacter = userCommands[index].charAt(0);
            });

            let roomLocation = checkLocation(); // check user location

            //check compass character of command
            function movement(direction, roomValue) {
                if (direction == "n") return roomCollection[roomLocation].north[roomValue];
                else if (direction == "e") return roomCollection[roomLocation].east[roomValue];
                else if (direction == "s") return direction = roomCollection[roomLocation].south[roomValue];
                else if (direction == "w") return direction = roomCollection[roomLocation].west[roomValue];
            }
            
            //if movement can go that way display what happpens when we do and set user location to room key, else display
            //cant go that way text, we check against the movement direction function
            function displayMove(direction) {
                movement(direction, 2) ? (displayCommand(movement(direction, 4)), userLocation = (movement(direction, 1))) :
                    displayCommand(movement(direction, 3));
            }
            
            // if direction move command first letter is a compass character we check if we can go that way displaymove(direction)
            if (movement("n", 0).includes(getCharacter)) displayMove("n");
            else if (movement("e", 0).includes(getCharacter)) displayMove("e");
            else if (movement("s", 0).includes(getCharacter)) displayMove("s");
            else if (movement("w", 0).includes(getCharacter)) displayMove("w");

        },
        //the main function to look around rooms
        lookAround: function () {
            let itemUl = document.createElement("ul");
       
            var location = roomCollection[checkLocation()].name; //check user location
            //check all the items 
            for (let i = 0; i < itemCollection.length; i++) {
                //create elements set to proper class
                var itemList = document.createElement("li");
                let insideUl = document.createElement("ul");
                insideUl.className = "insideUL";
                var insideList = document.createElement("li");
                //if user in room and item is visible
                if ((location == itemCollection[i].inRoom) && (itemCollection[i].isVisible === true)) {
                    itemList.innerHTML = (itemCollection[i].look); //append item text to LI element
                    itemUl.appendChild(itemList); //append element to UL element
                    if (itemCollection[i].hasOwnProperty("contains") != true || itemCollection[i].canSeeInside == false){}
                    // if the item contains items and we can see inside we create the elements and add them to the item list
                    // so they appear as sub items.
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
                        // if the item is empty we display this item is empty
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

        //if command is valid move command without direction we display this
        confirmMove: function () {
            displayCommand("where do you want to " + userCommands[0] + "?");
        }
    }
    //this checks the location of the user based on room key
    function checkLocation() {
        for (let i = 0; i < roomCollection.length; i++) {
            if (userLocation == roomCollection[i].name) return i;
        }
    }

    //main function to check user commands after thy have been validated
    function uCommands(length) {
        let one = userCommands[0]; //the first word of the command etc
        let two = userCommands[1];
        let three = userCommands[2];
        //object for if command is this length check this, if its length is 2 do this etc
        let commandLength = {
            //f user typed in single command, it must be valid, check what command it is and run function
            1: function () {
                if (roomCommands.lookCommand.includes(one))
                    roomCommands.lookAround();
                else if (roomCommands.moveCommands.includes(one))
                    roomCommands.moveCharacterTo();
                else if (roomCommands.movePreproposition.includes(one))
                    roomCommands.confirmMove();
            },
            //if user has typed in 2 commands they must be valid **right now we only can only move**
            //commands MUST be in righ order we can "go north" we cant "north go"
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

/*checks commands, if its an interface command run here, if its not an interface command 
it is valid but it must be a room command we need to check the rooms -SEE NOTE 3-*/
function isCommandValid(userCommands, validUserInputs, commandList) {
    
    //we can use command (save) we cant use commands (save save) so interface commands should be length of 1
    function checkInterfaceCommand(commandListIndex) {
        if (commandList[commandListIndex].interfaceCommand.includes(userCommands[0])) {
            userCommands.length == 1 ? displayCommand(commandList[commandListIndex].display) :
                displayCommand("you have used " + userCommands[0] + " in a way I dont understand");
        }
    }
    // check interface commands and for each when i is less than 4 we check user command against interface command, if its not in there
    // we check against the other main room commands in 4
    for (var i = 0; i < commandList.length; i++) {
        i < 4 ? checkInterfaceCommand(i) : commandList[4].collect();
    }
}

//main function to check if ommand typed is valid
function checkCommands(userCommands) {

    //list of interfce command obhects thats will display info or run functions for actions suh as save, load
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
            //all valid game commands otehr than interface commands
            interfaceCommand: ["look", "l", "north", "east", "south", "west", "n", "e", "s", "w", "walk", "go", "run", "get", "look", "at"],
        
            //interface commands are seperated into various arrays
            collect: function () {
                var lookCommands = this.interfaceCommand.slice(0, 2);
                var moveCommands = this.interfaceCommand.slice(2, 10);
                var movePreproposition = this.interfaceCommand.slice(10, 13);
                var itemCommands = this.interfaceCommand.slice(13, 15);
                var itemPrepropositionCommands = this.interfaceCommand.slice(15, 16);

                //arrays sent to room function
                if (this.interfaceCommand.includes(userCommands[0]))
                    roomInterface(userCommands, lookCommands, moveCommands, movePreproposition, itemCommands, itemPrepropositionCommands);
            }
        }];
    //function to seperate valid commands from unvalid commands
    function findCommands() {
        var interfaceCommandsArray = []; //all valid commands here
        var wrongCommandsArray = []; // all invalid commands here

        // pushes all valid commands to array
        for (var i = 0; i < commandList.length; i++) {
            var interfaceCommands = commandList[i].interfaceCommand;
            for (var x = 0; x < interfaceCommands.length; x++) {
                interfaceCommandsArray.push(interfaceCommands[x]);
            }
        }

        //pushes all invalid commands to array
        wrongCommandsArray = userCommands.filter(function (wc) {
            return interfaceCommandsArray.indexOf(wc) < 0;
        });

        /*if there are any words in the wrong commands array the user must have typed in a wrong 
        command somewhere and thus we display the wrong first command as per Zork -SEE NOTE 1-*/
        wrongCommandsArray.length > 0 ? displayCommand("I don\'t know the word \xa0" + '"' + wrongCommandsArray[0] + '"' + ".") :
            isCommandValid(userCommands, interfaceCommandsArray, commandList);
    }
    findCommands();
}

/*gets user input and put it in array, removed all empty elements and puts elements in 
lower case and display user input*/
function getUserInput(event) {
    var key = event.keyCode; // return key
    var userInput;
    var commandTrim;
    var commandLower;
    var commandArray = [];
    var filterd;
    var pUserInput = document.createElement("p");
    
    pUserInput.className = "userInput"; // gets user input from form input element

    //used to remove empty elements from user commands so we ignor extra spaces
    function removeEmpty(element) {
        if (element != '') return element;
    }

    //makes sure there are not too many P childs in display area so we delete them over a certain number
    function deleteInput(current = displayArea.childElementCount, max = 50) {

        if (current > max) {
            /*deletes twice as we add twice -SEE NOTE 2-*/
            displayArea.removeChild(displayArea.firstChild);
            displayArea.removeChild(displayArea.firstChild);
        }
        console.log(" current " + current + " max nodes " + max);
    }

    /*checks command for usable verbs/nouns makes sure its not empty space or jst pressed return*/
    function checkIsEmpty() {
        filterd.length === 0 ? displayCommand("Pardon!") : checkCommands(filterd);
    }

    /*sets margin bottom when first input activated. only used once for presentaton consitency*/
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

    //when return is pressed
    if (key === 13) {
        setStartElement(); // set margin bottom on first element
        event.preventDefault(); //prevent any default actions from element
        userInput = input.value; // put user input here
        commandTrim = userInput.trim(); //trim any extra spaces from ends of string
        commandLower = commandTrim.toLowerCase(); //put string to lower case
        commandArray = commandLower.split(" "); //put string into array each element seperated by spaces
        filterd = commandArray.filter(removeEmpty); // remove any empty elements that where added as spaces
        pUserInput.append("\x3e" + "\xa0\xa0" + userInput); //append command to this element
        displayArea.append(pUserInput);//display what the user typed in first instance
        checkIsEmpty(); //run this function check if anything was typed
        input.value = ""; // reset inptu value 
        deleteInput(); //check how many P elements there are delete if too many

    }
}
input.addEventListener("keydown", getUserInput); //get user key press
