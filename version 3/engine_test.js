const input = document.getElementById("input");
const displayArea = document.getElementById("display");

let userData = {
    location: "kitchen",
    inventory: [],
}

//display any text to user not including pre type
function displayCommand(text) {
    let pText = document.createTextNode(text);
    let pCommand = document.createElement("p");
    pCommand.appendChild(pText);
    displayArea.appendChild(pCommand);
}

//gets the item data we are currently searching for
function getItemData(items) {
    let itemIndexOne = itemCollection.findIndex(x => x.name.includes(items[0]));
    let itemIndexTwo = itemCollection.findIndex(x => x.name.includes(items[1]));

    let item1Data = itemCollection[itemIndexOne];
    let item2Date = itemCollection[itemIndexTwo];
    return {
        first: item1Data,
        firstIndex: itemIndexOne,
        second: item2Date,
        secondIndex: itemIndexTwo,
    };
}

//check if item is not visible
function itemNotVisible(canLookAt, itemLocation) {
    let itemLocationHere;
    let containerLocation;

    console.log(canLookAt);
    console.log(itemLocation);

    //check if item location is in a item if it is it has a container location
    for (let i = 0; i < itemCollection.length; i++) {
        if (itemCollection[i].name.includes(itemLocation))
            containerLocation = itemCollection[i].location;
    }

    //check room collection, if item location is in a room or container is in a room store that location
    for (let i = 0; i < roomCollection.length; i++) {
        if (itemLocation == roomCollection[i].name || containerLocation == roomCollection[i].name)
            itemLocationHere = roomCollection[i].name;
    }
    // if container in inventory then changce item location is user room
    if (containerLocation == "inventory" || itemLocation == "inventory")
        itemLocationHere = userData.location;

    // return true if item location is not in user room
    return itemLocationHere != userData.location || !canLookAt ? true : false;
}

//removes an item interact
function removeInteract(toRemove, index) {
    let item = itemCollection[index].possibleInteract.indexOf(toRemove);
    itemCollection[index].possibleInteract.splice(item, 1);
}

//adds an interact
function addInteract(toAdd, index) {
    itemCollection[index].possibleInteract.push(toAdd);
}

function createTextNode(text, element) {
    let textNode = document.createTextNode(text);
    let elementNode = document.createElement(element);
    elementNode.appendChild(textNode);
    return elementNode;
}

var roomCommands = {


    lookAtObjects: function (item) {
        console.log(item);

        //        let lookAtText = item.values.first;
        //        let item = values.first;
        //        let itemIndex = values.firstIndex;



    },

    lookAround: function () {

        let roomIndex = roomCollection.findIndex(x => x.name.includes(userData.location));
        let pMainNode = createTextNode(roomCollection[roomIndex].roomDescription, "p");
        let containElement = document.createElement("div");
        containElement.appendChild(pMainNode);
        containElement.id = "textArea";

        function hasDefault(item) {
            for (const x in itemCollection) {
                if (itemCollection[x].location == item && !itemCollection[x].hasOwnProperty("defaultLook") && itemCollection[x].possibleInteract.includes("roomLook"))
                    return true
            }
            return false
        }

        function defaultDisplay(item) {
            for (const x in itemCollection) {
                if (itemCollection[x].location == item && itemCollection[x].hasOwnProperty("defaultLook") && itemCollection[x].possibleInteract.includes("roomLook")) {
                    let defaultText = createTextNode(itemCollection[x].defaultLook, "p");
                    containElement.appendChild(defaultText);
                    console.log(itemCollection[x].defaultLook)

                    if (itemCollection[x].possibleInteract.includes("seeInside") && itemCollection[x].contains.length > 0) {
                        let ulLevelOne = document.createElement("ul");
                        ulLevelOne.className = "insideUL";
                        let containOne = createTextNode(itemCollection[x].containText, "li");
                        ulLevelOne.appendChild(containOne);
                        containElement.appendChild(ulLevelOne);
                        insideItemDisplay(itemCollection[x].contains).forEach(function (e) {
                            let insideItemOne = createTextNode(e, "li");
                            ulLevelOne.appendChild(insideItemOne);
                            containElement.appendChild(ulLevelOne);
                        })
                    }

                }
            }
        }

        function insideItemDisplay(items) {
            let result = [];
            for (const x in itemCollection) {
                items.forEach(function (e) {
                    if (itemCollection[x].name[0] == e && !itemCollection[x].hasOwnProperty("defaultLook") && itemCollection[x].possibleInteract.includes("roomLook")) {
                        object = []
                        object.push(itemCollection[x].displayName);
                        result.push("A " + object);
                    }
                });
            }
            return result;
        }

        for (const x in itemCollection) {
            if (itemCollection[x].location == userData.location && itemCollection[x].hasOwnProperty("defaultLook") && itemCollection[x].possibleInteract.includes("roomLook")) {
                let defaultText = createTextNode(itemCollection[x].defaultLook, "p");
                containElement.appendChild(defaultText);
                console.log(itemCollection[x].defaultLook);
            } else if (itemCollection[x].location == userData.location && itemCollection[x].hasOwnProperty("look") && itemCollection[x].possibleInteract.includes("roomLook")) {
                let lookText = createTextNode(itemCollection[x].look, "p");
                containElement.appendChild(lookText);

                console.log(itemCollection[x].look)
                if (itemCollection[x].possibleInteract.includes("seeInside") && itemCollection[x].contains.length > 0) {
                    let ulLevelOne = document.createElement("ul");
                    ulLevelOne.className = "insideUL";
                    let containOne = createTextNode(itemCollection[x].containText, "li");
                    ulLevelOne.appendChild(containOne);
                    containElement.appendChild(ulLevelOne);

                    console.log(itemCollection[x].containText)
                    insideItemDisplay(itemCollection[x].contains).forEach(function (e) {
                        let insideItemOne = createTextNode(e, "li");
                        ulLevelOne.appendChild(insideItemOne);
                        containElement.appendChild(ulLevelOne);
                        let ret = e.replace("A", '').replace(/\s/g, '');

                        console.log(e);
                        for (const y in itemCollection) {
                            if (itemCollection[y].name.includes(ret) && itemCollection[y].hasOwnProperty("containText") && itemCollection[y].possibleInteract.includes("seeInside")) {
                                let ulLevelTwo = document.createElement("ul");
                                ulLevelTwo.className = "insideUL";
                                let containTwo = createTextNode(itemCollection[y].containText, "li");
                                ulLevelTwo.appendChild(containTwo);
                                insideItemOne.appendChild(ulLevelTwo);
                                containElement.appendChild(ulLevelOne);

                                console.log(itemCollection[y].containText);
                                insideItemDisplay(itemCollection[y].contains).forEach(function (element) {
                                    let insideItemTwo = createTextNode(element, "li");
                                    ulLevelTwo.appendChild(insideItemTwo);
                                    containElement.appendChild(ulLevelOne);

                                    console.log(element);

                                })
                            }
                        }
                    })
                }
            } else if (itemCollection[x].location == userData.location && itemCollection[x].contains.length > 0 && itemCollection[x].possibleInteract.includes("seeInside")) {
                defaultDisplay(itemCollection[x].name[0])
                let store = [];

                if (hasDefault(itemCollection[x].name[0]) && itemCollection[x].hasOwnProperty("containText") && itemCollection[x].possibleInteract.includes("seeInside")) {
                    let ulLevelOne = document.createElement("ul");
                    ulLevelOne.className = "insideUL";
                    let containOne = createTextNode(itemCollection[x].containText, "li");
                    ulLevelOne.appendChild(containOne);

                    console.log(itemCollection[x].containText)
                    insideItemDisplay(itemCollection[x].contains).forEach(function (e) {
                        let insideItemOne = createTextNode(e, "li");
                        ulLevelOne.appendChild(insideItemOne);
                        containElement.appendChild(ulLevelOne);

                        console.log(e);
                        let ret = e.replace("A", '').replace(/\s/g, '');
                        for (const y in itemCollection) {
                            if (itemCollection[y].name.includes(ret) && itemCollection[y].hasOwnProperty("containText") && itemCollection[y].possibleInteract.includes("seeInside")) {
                                let ulLevelTwo = document.createElement("ul");
                                ulLevelTwo.className = "insideUL";
                                let containTwo = createTextNode(itemCollection[y].containText, "li");
                                ulLevelTwo.appendChild(containTwo);
                                insideItemOne.appendChild(ulLevelTwo);

                                console.log(itemCollection[y].containText);
                                insideItemDisplay(itemCollection[y].contains).forEach(function (element) {
                                    let insideItemTwo = createTextNode(element, "li");
                                    ulLevelTwo.appendChild(insideItemTwo);
                                    containElement.appendChild(ulLevelOne);

                                    console.log(element);
                                    let retTwo = element.replace("A", '').replace(/\s/g, '');
                                    for (const z in itemCollection) {
                                        if (itemCollection[z].name.includes(retTwo) && itemCollection[z].hasOwnProperty("containText") && itemCollection[z].possibleInteract.includes("seeInside")) {
                                            let ulLevelThree = document.createElement("ul");
                                            ulLevelThree.className = "insideUL";
                                            let containThree = createTextNode(itemCollection[z].containText, "li");
                                            ulLevelThree.appendChild(containThree);
                                            insideItemTwo.appendChild(ulLevelThree);

                                            console.log(itemCollection[z].containText);
                                            insideItemDisplay(itemCollection[z].contains).forEach(function (elementTwo) {
                                                let insideItemThree = createTextNode(elementTwo, "li");
                                                ulLevelThree.appendChild(insideItemThree);
                                                containElement.appendChild(ulLevelOne);

                                                console.log(elementTwo);
                                                console.timeEnd("test");
                                            })
                                        }
                                    }

                                })
                            }
                        }
                    })
                }
            }
        }
        displayArea.appendChild(containElement);
        const boxes = document.getElementById('textArea');
        console.log(boxes);

        let test = [].slice.call(boxes.children)
        console.log(test);

    },
    moveCharacterTo: function () {
        displayCommand("moving test")
    },
    getObject: function (items) {
        let values = getItemData(items);
        let item = values.first;
        let itemIndex = values.firstIndex;

        function filterContainer() {
            let container = values.secondIndex;
            let itemName = values.first.name[0];
            if (container != -1) {
                itemCollection[container].contains = itemCollection[container].contains.filter(function (item) {
                    return item != itemName;
                });

                let itemSize = values.first.size;
                itemCollection[container].capacity[1] = itemCollection[container].capacity[1] - itemSize;
            }
        }

        //if not item enterd display confirm action 
        function checkEmpty() {
            items.length == 0 ? displayCommand("what do you want to get?") :
                checkItem();
        }

        // if item enterd check if user has it and you can see it and if you can get it
        function checkItem() {

            if (item.location == "inventory")
                displayCommand("You already have it");
            else if (itemNotVisible(item.possibleInteract.includes("lookAt"), item.location))
                displayCommand("You can't see any " + item.displayName + " here!");
            else if (!item.possibleInteract.includes("get"))
                displayCommand("There is no point picking that up or its too heavy");
            else {
                //special functionget stops default get actions
                if (item.hasOwnProperty("functionGet"))
                    itemCollection[itemIndex].functionGet();
                else {
                    userData.inventory.push(itemIndex);

                    console.log(userData.inventory);

                    itemCollection[itemIndex].location = "inventory";
                    removeInteract("get", itemIndex);
                    removeInteract("roomLook", itemIndex);
                    changeTextOnce(itemIndex);
                    //filterContainer();
                    displayCommand("taken");
                }
            }

        }
        checkEmpty();
    },
    dropItem: function (items) {

        function checkEmpty() {
            items.length == 0 ? displayCommand("what do you want to drop?") :
                checkItem();
        }

        function checkItem() {
            let values = getItemData(items);
            let itemIndex = values.firstIndex;
            let itemName = values.first.name[0];
            let inInventory = userData.inventory.indexOf(itemIndex);

            //            function inContainer() {
            //                let found = false
            //                userData.inventory.forEach(function (e, i) {
            //                    if (itemCollection[e].contains.includes(itemName) && (itemCollection[e].possibleInteract.includes("close")))
            //                        found = true;
            //                });
            //                return found;
            //            }
            //
            //            console.log(inContainer());
            if (inInventory == -1)
                displayCommand("you don't have that!");
            else {
                itemCollection[itemIndex].location = userData.location;
                addInteract("get", itemIndex);
                addInteract("roomLook", itemIndex);
                if (itemCollection[itemIndex].hasOwnProperty("changeTextFromDrop")) {
                    itemCollection[itemIndex].changeTextFromDrop();
                }
                userData.inventory.splice(inInventory, 1);
                displayCommand("you drop the " + values.first.displayName + " in the " + userData.location);
            }
        }

        checkEmpty();

    },
    closeItem: function (items) {

        function checkEmpty() {
            items.length === 0 ? displayCommand("what do you want to close?") :
                checkItem();
        }

        function checkItem() {
            let values = getItemData(items);
            let itemIndex = values.firstIndex;
            let canClose = values.first.possibleInteract.includes("close");
            let canOpen = values.first.possibleInteract.includes("open");

            if (itemNotVisible(values.first.possibleInteract.includes("lookAt"), values.first.location))
                displayCommand("I don't see any " + values.first.displayName + " here!");
            else if (!canClose && !canOpen)
                displayCommand("you cant close that");
            else if (canOpen)
                displayCommand("its already closed");
            else {
                removeInteract("close", itemIndex);
                removeInteract("seeInside", itemIndex);
                addInteract("open", itemIndex);
                if (values.first.hasOwnProperty("changeTextLookAtFromClose"))
                    itemCollection[itemIndex].changeTextLookAtFromClose();
                if (values.first.hasOwnProperty("closeAlways"))
                    itemCollection[itemIndex].closeAlways();
                displayCommand("you close the " + values.first.displayName);
            }

        }

        checkEmpty();
    },
    openObject: function (items) {

        function checkEmpty() {
            items.length === 0 ? displayCommand("what do you want to open?") :
                checkItem();
        }

        function checkItem() {
            let values = getItemData(items);
            let itemIndex = values.firstIndex;
            let canClose = values.first.possibleInteract.includes("close");
            let canOpen = values.first.possibleInteract.includes("open");
            let openText = values.first.openText;

            if (itemNotVisible(values.first.possibleInteract.includes("lookAt"), values.first.location))
                displayCommand("I don't see any " + values.first.displayName + " here!");
            else if (!canClose && !canOpen)
                displayCommand("you cant open that");
            else if (canClose)
                displayCommand("its already open");
            else {
                //special functionget stops default get actions
                if (values.first.hasOwnProperty("openInterupt"))
                    itemCollection[itemIndex].openInterupt();
                else {
                    if (values.first.hasOwnProperty("openAlways"))
                        itemCollection[itemIndex].openAlways();
                    removeInteract("open", itemIndex);
                    addInteract("close", itemIndex);
                    addInteract("seeInside", itemIndex);
                    changeTextOnce(itemIndex);
                    displayCommand(openText)
                }
            }
        }

        checkEmpty()
    },
    putItemInto: function (items) {
        let values = getItemData(items);
        let itemIndexOne = values.firstIndex;
        let itemIndexTwo = values.secondIndex;
        let inInventory = userData.inventory.indexOf(itemIndexOne);
        let item2IsClosed = values.second.possibleInteract.includes("open");
        let itemInvIndex = userData.inventory.indexOf(itemIndexOne);

        function checkEmpty() {
            items.length === 0 ? displayCommand("what do you want to put that into?") :
                checkItem();
        }

        function checkItem() {

            if (itemNotVisible(values.first.possibleInteract.includes("lookAt"), values.first.location))
                displayCommand("you don't have that!");
            else if (inInventory == -1)
                displayCommand("you don't have the " + values.first.displayName);
            else if (item2IsClosed == true)
                displayCommand("The " + values.second.displayName + " isn't open");
            else {
                itemCollection[itemIndexTwo].capacity[1] = itemCollection[itemIndexTwo].capacity[1] += values.first.size;
                if (itemCollection[itemIndexTwo].capacity[1] > itemCollection[itemIndexTwo].capacity[0]) {
                    displayCommand("There's no room.")
                    itemCollection[itemIndexTwo].capacity[1] = itemCollection[itemIndexTwo].capacity[1] -= values.first.size;
                } else {
                    itemCollection[itemIndexOne].location = itemCollection[itemIndexTwo].name[0];
                    userData.inventory.splice(itemInvIndex, 1);
                    itemCollection[itemIndexTwo].contains.push(itemCollection[itemIndexOne].name[0]);
                    itemCollection[itemIndexTwo].contains = [...new Set(itemCollection[itemIndexTwo].contains)];
                    addInteract("roomLook", itemIndexOne);
                    addInteract("get", itemIndexOne);
                    displayCommand("Done.");
                }

            }

        }
        checkEmpty();
    },

    unlockItem: function (items) {
        console.log(items);
        displayCommand("unlock");
        let values = getItemData(items);
        var item = values.second;

        console.log(item);
    }
}

function checkCommands(userCommandsArray) {

    //list of all commands
    const commandLists = [
        {
            commands: ["about", "info"],
            actions: () => displayCommand("adventure game test room with one room to escape from. copywrite: Mark Ikin 2020")
        },
        {
            commands: ["commands", "help"],
            actions: () => displayCommand("here is some useful information about the game and commands")
        },
        {
            commands: ["save"],
            actions: () => displayCommand("you can save someday but not today")
        },
        {
            commands: ["load", "restore"],
            actions: () => displayCommand("you can load maybe")
        },
        {
            commands: ["inv", "inventory"],
            actions: () => {
                if (userData.inventory.length === 0)
                    displayCommand("You are empty-handed.");
                else {
                    let text = document.createTextNode("You are carrying:");
                    let textNode = document.createElement("li");
                    textNode.appendChild(text);
                    let ulNode = document.createElement("ul");
                    ulNode.appendChild(textNode);
                    ulNode.className = "insideUL";
                    userData.inventory.forEach(function (e) {
                        let textNodeInner = document.createElement("li");
                        let textInner = document.createTextNode("A " + itemCollection[e].displayName);
                        textNodeInner.appendChild(textInner);
                        ulNode.appendChild(textNodeInner);
                    });
                    displayArea.append(ulNode);
                }
            }
        },
        {
            commands: [["look", "l", "north", "east", "south", "west", "n", "e", "s", "w", "walk", "go", "run", "examine", "inspect", "the", "at", "look", "open", "close", "get", "pick", "up", "turn", "with", "drop", "put", "down", "release", "leave", "here", "in", "move", "unlock", "with"], /*items*/ ["sack", "garlic", "bottle", "water", "lunch", "table", "elongated", "brown", "glass", "quantity", "of", "screw", "screwdriver", "clove", "picture", "painting", "paper", "safe", "metal", "key"] /*items*/ ],
            actions: () => displayCommand("your commands here")
        }];

    //first check for wrong word(any word not in list) and display I dont know that word if word not in list
    function wrongCommandCheck() {
        const mainCommands = commandLists[5].commands[1];
        const items = commandLists[5].commands[0];
        const combinedAllCommands = [...items, ...mainCommands, ...commandLists[0].commands, ...commandLists[1].commands, ...commandLists[2].commands, ...commandLists[3].commands, ...commandLists[4].commands];
        let wrongCommandsArray = [];

        wrongCommandsArray = userCommandsArray.filter(function (wc) {
            return combinedAllCommands.indexOf(wc) < 0;
        });

        wrongCommandsArray.length > 0 ? displayCommand("I don't know the word \xa0" + '"' + wrongCommandsArray[0] + '"' + ".") :
            checkForInterfaceAction(userCommandsArray);
    }

    //second check if word was interface word if so do that action, if interface word enterd incorectly say so. if word not in interface and is in word list then go to check command
    function checkForInterfaceAction() {
        let storeAction = "";

        for (let i = 0; i < commandLists.length - 1; i++) {
            if (commandLists[i].commands.includes(userCommandsArray.forEach(function (e) {
                    if (commandLists[i].commands.includes(e))
                        storeAction = commandLists[i].actions;
                }))) {}
        }

        if (userCommandsArray.length > 1 && storeAction instanceof Function)
            displayCommand("You have used the word " + "\"" + userCommandsArray[0] + "\"" + " in a way that I don't understand.");
        else if (storeAction)
            storeAction();
        else
            checkMainCommand();
    }
    /* check the command to see if it matches a correct command string. process is to take (any) user input from capture groups. any input in correct order evaluates as true with test. take any user input into an array using exec. scan array and put any correctly named items evaluated against item list into array 0 or 1. if items not corectly named it returns nothing in element. now we input the correct named objects or empty elements into a new regex to evaluate with test. if objects are named correcty they return to regex and test true against user command if they are empty they test false against user command.*/
    function checkMainCommand() {
        let commandString = userCommandsArray.toString().replace(/,/g, "");
        //        let commandString = userCommandsArray.toString().replace(/,/g, " ");
        let result;
        let goTo;
        let itemsOneTwo = [];
        let regex;

        const lines = {

            //            ^look(?<object1>.*?)(the)+at$
            //            , /^look(?<object1>.*)at$/

            lookAround: [/^look$/, /^l$/],
            lookAtItem: [/^look((at){1,2})((the)+)?(?<object1>.*)?$/, /^look(?<object1>.*?)((the)+)?at$/],
            directions: [/^go[nesw]?(north|east|south|west)?$/, /^walk[nesw]?(north|east|south|west)?$/, /^run[nesw]?(north|east|south|west)?$/, /^north$/, /^east$/, /^south$/, /^west$/, /^n$/, /^e$/, /^s$/, /^w$/],
            getItem: [/^pickup(the)?$/, /^pick(?<object1>.*)up$/, /^pickupthe(?<object1>.*)$/], //other get commands are take,get
            putDownItem: [/^drop(?<object1>.*)?$/, /^drop(?<object1>.*)?here$/, /^dropthe(?<object1>.*)?$/, /^dropthe(?<object1>.*)?here$/],
            putItemIn: [/^put(the)?(?<object1>.*)in(the)?(?<object2>.*)$/],
            openItem: [/^open(the)?$/, /^openthe(?<object1>.*)$/],
            closeItem: [/^close(the)?$/, /^closethe(?<object1>.*)$/],
            unlock: [/^unlock(the)?(?<object1>.*)with(the)?(?<object2>.*)$/, /^unlock$/],
        }

        function lineCheck() {
            for (const property in lines) {
                for (let i = 0; i < lines[property].length; i++) {
                    if (lines[property][i].test(commandString)) {
                        return {
                            goto: property,
                            result: lines[property][i].exec(commandString),
                            regex: lines[property][i].toString().replace(/\//g, '')
                        }
                    }
                }
            }
        }


        let checkLines = lineCheck();
        console.log(checkLines);

        //        for (const property in lines) {
        //            lines[property].forEach(function (e, i) {
        //                if (e.test(commandString)) {
        //                    console.log(lines[property]);
        //                    console.log(e.test(commandString));
        //                    goTo = property;
        //                    result = e.exec(commandString);
        //                    regex = e.toString();
        //                    regex = regex.replace(/\//g, '');
        //                }
        //            })
        //        }


        if (typeof checkLines !== "undefined") {
            checkLines.result.forEach(function (e) {
                for (let property in itemCollection) {
                    if (itemCollection[property].name.includes(e))
                        itemsOneTwo.push(e)
                }
            });
            //            regex = checkLines.regex.replace("(?<object1>.*)?", "(" + itemsOneTwo[0] + ")?");
            regex = checkLines.regex.replace("(?<object1>.*)", "(" + itemsOneTwo[0] + ")").replace("(?<object2>.*)", "(" + itemsOneTwo[1] + ")");

            regex = new RegExp(regex, "g");


            if (!regex.test(commandString))
                goTo = "null";
            else
                goTo = checkLines.goto;

            console.log(itemsOneTwo);
            console.log(regex);
            console.log(goTo);
        }

        let commandSearch = (({
            lookAround: () => roomCommands.lookAround(),
            lookAtItem: () => roomCommands.lookAtObjects(itemsOneTwo),
            directions: () => roomCommands.moveCharacterTo(),
            getItem: () => roomCommands.getObject(itemsOneTwo),
            putDownItem: () => roomCommands.dropItem(itemsOneTwo),
            putItemIn: () => roomCommands.putItemInto(itemsOneTwo),
            openItem: () => roomCommands.openObject(itemsOneTwo),
            closeItem: () => roomCommands.closeItem(itemsOneTwo),
            unlock: () => roomCommands.unlockItem(itemsOneTwo),
        })[goTo] || (() => displayCommand("that command does not make sense to me")))();

    }

    wrongCommandCheck();

}

//takes user input into an array, formats and displays message if nothing enterd, if something enterd go to checkCommands. also dipays anything user types in as pre type.
function getUserInput(event) {
    console.time("test");
    if (event.keyCode === 13) {
        let pUserInput = document.createElement("pre");
        pUserInput.className = "userInput";

        let userInputArray = input.value;
        let showUserInput = input.value;

        event.preventDefault();

        userInputArray = userInputArray.trim().toLowerCase().split(" ").filter(function (element) {
            return element != '';
        });

        pUserInput.append("\x3e\x3e\xa0\xa0" + showUserInput);
        displayArea.append(pUserInput);

        userInputArray.length === 0 ? displayCommand("Pardon!") : checkCommands(userInputArray);

        input.value = "";
    }
}

//start by looking for return key press
input.addEventListener("keydown", getUserInput);
