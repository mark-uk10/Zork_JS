const input = document.getElementById("input");
const displayArea = document.getElementById("display");
var userInventory = [];
var userLocation = "kitchen";

function displayCommand(text, items) {
    let pText = document.createTextNode(text);
    console.log(text);
    console.log(pText);
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

function removeInteract(toRemove, index) {
    let item = itemCollection[index].possibleInteract.indexOf(toRemove);
    itemCollection[index].possibleInteract.splice(item, 1);
}

function addInteract(toAdd, index) {
    itemCollection[index].possibleInteract.push(toAdd);
}

function checkItems(checkWhat) {
    for (let i = 0; i < itemCollection.length; i++) {
        if (itemCollection[i].name.includes(checkWhat))
            return i;
    }
    return 0;
}

function hasProperty(index, property) {
    if (itemCollection[index].hasOwnProperty(property)) {
        return itemCollection[index][property]

    } else
        return "false"
}

function checkInteract(checkWhat, command) {
    return itemCollection[checkItems(checkWhat)].possibleInteract.includes(command);
}

const roomCollection = [
    {
        name: "kitchen",
        roomDescription: "you are standing in a small kitchen. A table seems to have been used recently for the preperation of food. there is a door leading to a corridor to the north",
        north: ["n", "corridor", true, "there is a door blocking your way", "you go north"],
        east: ["e", "null", false, "you cant walk through walls"],
        south: ["s", "null", false, "you cant walk throught walls"],
        west: ["w", "null", false, "you cant walk throught walls"]
            },
    {
        name: "corridor",
        roomDescription: "you are in a well lit blue and white corridor, the kitchen is to the south, and there is a bedroom to the east",
        north: ["n", "null", false, "you cant walk through walls"],
        east: ["e", "bedroom", true, "the door is locked", "you go east"],
        south: ["s", "kitchen", true, "you cant walk throught walls", "you go south"],
        west: ["w", "null", false, "you cant walk through walls"]
            },
    {
        name: "bedroom",
        roomDescription: "you are in a bedroom there is a corridor to the west",
        north: ["n", "null", false, "you cant walk through walls"],
        east: ["e", "null", false, "you cant walk through walls"],
        south: ["s", "null", false, "you cant walk through walls"],
        west: ["w", "corridor", true, "you cant walk through walls", "you go west"]
            }];

const itemCollection = [
    {
        name: ["dummy", /dummy/g], // required
        location: "dummy", //required
        possibleInteract: [], //required
        textDisplays: { //optional displays
            look: "",
            lookAt: "",
            openText: "",
            containtext: "",
            emptyText: "",
            moveText: "",
            moveTextStatic: "",
            getTextStatic: ""
        },
        containerItem: { //optional for container items
            size: 0,
            capacity: [0, 0],
            contains: ["dummy", "dummy"],
            needsKey: false
        },
        itemFunctions: { //optional for dynamic text change or special interactions
            functionOpen: function () {},
            functionClose: function () {},
            functionIsUsed: function () {}, //certain actions permantly change some item text
            functionGet: function () {}
        }

        },
    {
        name: ["sack", "brown sack", "elongated brown sack", "elongated sack", "brownsack", "elongatedbrownsack", "elongatedsack", /sack(?!brown|elongated)|brownsack|elongatedbrownsack|elongatedsack/g],
        location: "kitchen",
        possibleInteract: ["roomLook", "open", "lookAt", "get"],
        textDisplays: {
            look: "On the table is an elongated brown sack, smelling of hot peppers",
            lookAt: "The brown sack is closed",
            openText: "opening the brown sack reveals a clove of garlic and a lunch",
            containText: "The brown sack contains:",
            emptyText: "The brown sack is empty",
        },
        containerItem: {
            contains: ["garlic", "lunch"],
            capacity: [3, 2],
        },
        itemFunctions: {
            functionIsUsed: function () {
                this.look = "There is a brown sack here";
                this.openText = "You open the sack";
            },
            functionOpen: function () {
                itemCollection.forEach((e, i) => {
                    if (e.name.some(r => this.contains.indexOf(r) >= 0))
                        e.possibleInteract = ["lookAt", "roomLook", "get"];
                });
            },
            functionClose: function () {
                this.lookAt = "The brown sack is closed.";
                itemCollection.forEach((e, i) => {
                    if (e.name.some(r => this.contains.indexOf(r) >= 0))
                        e.possibleInteract = [];
                });
            },
        }
            },
    {
        name: ["table", /table/g],
        location: "kitchen",
        containText: "sitting on the kitchen table is:",
        emptyText: "nothing is on the table of interest",
        contains: ["sack", "bottle"],
        possibleInteract: ["lookAt", "seeInside"],
        capacity: [99, 3],
            },
    {
        name: ["garlic", "clove", "garlicclove", "cloveofgarlic", /cloveofgarlic|garlicclove|clove(?!garlic)|garlic/g], //contains in sack it is not usable until sack is open
        location: "sack",
        look: "There is a clove of garlic here",
        lookAt: "you see nothing special about the garlic",
        possibleInteract: [],
        size: 1,
            },
    {
        name: ["lunch", "lunch", /lunch/g], //contains in sack it is not usable until sack is open
        location: "sack",
        look: "there is a lunch here",
        lookAt: "Looks like a nice cheese sandwich",
        possibleInteract: [],
        size: 1,
            },
    {
        name: ["bottle", "glass bottle", "glassbottle", /bottle(?!glass)|glassbottle/g],
        location: "kitchen",
        emptyText: "the glass bottle is empty",
        look: "A bottle is sitting on the table",
        openText: "you open the bottle",
        containText: "the glass bottle contains:",
        contains: ["quantity of water"],
        possibleInteract: ["roomLook", "lookAt", "seeInside", "get"],
        size: 2,
        functionIsUsed: function () {
            this.look = "There is a glass bottle here";
        },
            },
    {
        name: ["picture", "painting", /picture|painting/g],
        location: "corridor",
        lookAt: "you see a picture of an old man",
        look: "A picture is hanging on the wall",
        moveText: "you move the picture from the wall, behind it is a metal safe, perhaps great wealth is inside.",
        possibleInteract: ["roomLook", "lookAt", "move", "get"],
        functionIsUsed: function () {
            this.look = "There is a picture on the floor here, a metal safe sits in the wall above it";
            let value = itemCollection.findIndex(x => x.name.includes("safe"));
            console.log(value);
            addInteract("lookAt", value);
            addInteract("get", value);
            console.log(itemCollection[7].possibleInteract);
        },
        functionGet: function () {
            let text = ("it looks loose, you can probably move it");
            if (!this.possibleInteract.includes("move"))
                text = ("It is too big and heavy to carry around, and why would you want it?");
            displayCommand(text);

        },
            },
    {
        name: ["safe", "metal safe", "metalsafe", /safe|metalsafe/g],
        location: "corridor",
        lookAt: "the metal safe has a key hole and is locked",
        openText: "Try as you may the safe will not open, it will need a key",
        moveTextStatic: "The safe is embeded into the wall and the door wont open",
        contains: ["paper"],
        needsKey: true,
        possibleInteract: ["open", "move"],
        functionGet: function () {
            displayCommand("That is far too heavy!");
        },
        functionOpen: function () {

        }
            },
    {
        name: ["quantity of water", "water", "quantityofwater", /quantityofwater|water/g],
        location: "bottle",
        lookAt: "you see nothing special about the water",
        drinkText: "you drink the water",
        possibleInteract: ["roomLook", "lookAt", "get"],
        functionGet: function () {
            let value = this.location;
            let number;
            itemCollection.forEach(function (e, i) {
                if (e.name[0] == value) {
                    number = i;
                    return value = e.location;
                }
            });
            if (value == userLocation && this.possibleInteract.includes("lookAt")) displayCommand("perhaps you should pick up the bottle");
            else if (value == "inventory" && this.possibleInteract.includes("get")) {
                displayCommand("the water slips through your fingers, very refreshing");
                itemCollection[number].contains.pop();
                console.log(checkItems(this.name));
                removeInteract("lookAt", checkItems(this.name[0]));
                removeInteract("get", checkItems(this.name[0]));
                console.log(this.possibleInteract);
            }
        }
            }];

function roomInterface(userCommands, items) {

    var roomCommands = {
        items: items,

        moveCharacterTo: function (moveCommands) {

            let roomLocation = checkLocation();
            let commandPre = ["go", "walk", "run"];
            let direction = ["north", "east", "south", "west", "n", "e", "s", "w"];

            function typedIn() {
                let n, x, z;

                moveCommands.length == 1 ? (n = commandPre.includes(moveCommands[0]), x = direction.includes(moveCommands[0])) :
                    z = direction.includes(moveCommands[1]);

                check(n, x, z);
            };

            function check(n, x, z) {
                console.log(moveCommands.length);
                console.log(n);
                console.log(x);
                console.log(z);
                let character;
                if (n == true)
                    displayCommand(moveCommands + " where ?");
                else if (moveCommands[0] === moveCommands[1])
                    displayCommand("you have used " + moveCommands[0] + " command in a way I dont understand");
                else if (x == true || z == true)
                    moveCommands.length === 1 ? movement(character = moveCommands[0].charAt(0)) :
                    movement(character = moveCommands[1].charAt(0));
            }

            function movement(direction) {
                let movingTo = [];
                if (direction == "n") movingTo = roomCollection[roomLocation].north;
                else if (direction == "e") movingTo = roomCollection[roomLocation].east;
                else if (direction == "s") movingTo = roomCollection[roomLocation].south;
                else if (direction == "w") movingTo = roomCollection[roomLocation].west;
                displayMove(movingTo)

                function displayMove() {
                    console.log(movingTo);
                    movingTo[2] ? (displayCommand(movingTo[4]), userLocation = movingTo[1]) :
                        displayCommand(movingTo[3]);
                }

            }

            typedIn();

        },
        lookAround: function () {
            let roomText = roomCollection[checkLocation()].roomDescription;
            let roomTextNode = document.createTextNode(roomText);
            let spanMain = document.createElement("span");
            let ulItemtext = document.createElement("ul");
            spanMain.appendChild(roomTextNode);

            for (let i = 0; i < itemCollection.length; i++) {
                if (userLocation == itemCollection[i].location && itemCollection[i].possibleInteract.includes("roomLook")) {
                    let liItemText = document.createElement("li");
                    let itemTextTextNode = document.createTextNode(itemCollection[i].look);
                    liItemText.appendChild(itemTextTextNode);
                    ulItemtext.appendChild(liItemText);
                    spanMain.appendChild(ulItemtext);
                    if (itemCollection[i].possibleInteract.includes("seeInside") && itemCollection[i].contains.length > 0) {
                        let ulInsideItems = document.createElement("ul");
                        ulInsideItems.className = "insideUL";
                        let textNodeContains = document.createTextNode(itemCollection[i].containText);
                        let liTextNodeContains = document.createElement("li");
                        liTextNodeContains.appendChild(textNodeContains);
                        ulInsideItems.appendChild(liTextNodeContains);
                        ulItemtext.appendChild(ulInsideItems);
                        itemCollection[i].contains.forEach(function (element, index) {
                            itemCollection.forEach(function (e) {
                                if (e.name.includes(element) && e.possibleInteract.includes("roomLook")) {
                                    let liItemInside = document.createElement("li");
                                    let liTextNodeItemInside = document.createTextNode("A " + e.name[0]);
                                    liItemInside.appendChild(liTextNodeItemInside);
                                    ulInsideItems.appendChild(liItemInside);
                                }
                            });
                        });
                    }
                }
            }
            console.log(spanMain);
            displayCommand("", spanMain);
        },

        getObject: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");
            let itemIndex = itemCollection.findIndex(x => x.name.includes(lastItemText));
            let itemLocation = itemCollection[itemIndex].location;
            let location = roomCollection[checkLocation()].name;
            let canLookAt = checkInteract(lastItemText, "lookAt");
            let isGetCommandThere = checkInteract(lastItemText, "get");

            function itemNotVisible() {
                let itemLocationHere;
                let containerLocation;

                for (let i = 0; i < itemCollection.length; i++) {
                    if (itemCollection[i].name.includes(itemLocation))
                        containerLocation = itemCollection[i].location;
                }

                for (let i = 0; i < roomCollection.length; i++) {
                    if (itemLocation == roomCollection[i].name || containerLocation == roomCollection[i].name)
                        itemLocationHere = roomCollection[i].name;
                }
                if (containerLocation == "inventory")
                    itemLocationHere = location;

                console.log("This is the item location either room or item " + itemLocation);
                console.log("This is the container location if an item is inside " + containerLocation);
                console.log("this is the item or container location after evaluation " + itemLocationHere);

                return itemLocationHere != location || !canLookAt ? true : false;
            }


            function checkSyntax() {
                lastItem.length == 0 ? displayCommand("what do you want to get?") :
                    checkItem();
            }

            function checkItem() {
                let itemName = itemCollection[itemIndex].name[0];

                function filterContainer() {
                    let itemInsideIndex = itemCollection.findIndex(x => x.name.includes(itemLocation));
                    if (itemInsideIndex != -1) {
                        itemCollection[itemInsideIndex].contains = itemCollection[itemInsideIndex].contains.filter(function (item) {
                            return item != itemName;
                        });

                        let itemSize = itemCollection[itemIndex].size;
                        itemCollection[itemInsideIndex].capacity[1] = itemCollection[itemInsideIndex].capacity[1] - itemSize;
                    }
                }

                if (itemLocation == "inventory")
                    displayCommand("You already have it");
                else if (itemNotVisible())
                    displayCommand("You can't see any " + lastItemText + " here!");
                else if (!isGetCommandThere)
                    displayCommand("There is no point picking that up or its too heavy");
                else {
                    if (itemCollection[itemIndex].hasOwnProperty("functionGet"))
                        itemCollection[itemIndex].functionGet();
                    else {
                        userInventory.push(itemCollection[itemIndex].name[0]);
                        itemCollection[itemIndex].location = "inventory";
                        removeInteract("get", itemIndex);
                        removeInteract("roomLook", itemIndex);
                        grab(lastItemText);
                        changeText();
                        filterContainer();
                        displayCommand("taken");
                    }
                }

            };
            checkSyntax();
        },

        lookAtObjects: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");

            function checkSyntax() {
                lastItem.length == 0 ? displayCommand("what do you want to look at?") :
                    checkItem();
            }

            function checkItem() {
                let itemText;
                let itemIndex = itemCollection.findIndex(x => x.name.includes(lastItemText));
                let canLookAt = checkInteract(lastItemText, "lookAt");
                let canSeeInside = checkInteract(lastItemText, "seeInside");
                let itemLookAtText = itemCollection[itemIndex].lookAt;
                let itemContains = hasProperty(itemIndex, "contains");
                let itemContaintext = itemCollection[itemIndex].containText;
                let itemLocation = itemCollection[itemIndex].location;
                let itemIsClosed = checkInteract(lastItemText, "open");
                let emptyText = itemCollection[itemIndex].emptyText;
                let location = roomCollection[checkLocation()].name;

                function displayContents() {
                    if (canSeeInside == true && itemContains.length == 0) {
                        itemText = emptyText;
                    } else {
                        let liText = document.createElement("li");
                        let ulNode = document.createElement("ul");
                        ulNode.className = "insideUL";
                        let textNode = document.createTextNode(itemContaintext);
                        liText.appendChild(textNode);
                        ulNode.appendChild(liText);
                        itemContains.forEach(function (e) {
                            for (let i = 0; i < itemCollection.length; i++) {
                                if (itemCollection[i].name.includes(e) && itemCollection[i].possibleInteract.includes("lookAt")) {
                                    let textNodeItemInside = document.createTextNode("A " + itemCollection[i].name[1]);
                                    let textNode = document.createElement("li");
                                    textNode.appendChild(textNodeItemInside);
                                    ulNode.appendChild(textNode);
                                }
                            };
                        });
                        itemText = ulNode;
                    }
                }

                function itemNotVisible() {
                    let itemLocationHere;
                    let containerLocation;

                    for (let i = 0; i < itemCollection.length; i++) {
                        if (itemCollection[i].name.includes(itemLocation))
                            containerLocation = itemCollection[i].location;
                    }

                    for (let i = 0; i < roomCollection.length; i++) {
                        if (itemLocation == roomCollection[i].name || containerLocation == roomCollection[i].name)
                            itemLocationHere = roomCollection[i].name;
                    }
                    if (containerLocation || itemLocation == "inventory")
                        itemLocationHere = location;

                    console.log("This is the item location either room or item " + itemLocation);
                    console.log("This is the container location if an item is inside " + containerLocation);
                    console.log("this is the item or container location after evaluation " + itemLocationHere);

                    return itemLocationHere != location || !canLookAt ? true : false;
                }
                console.log(itemNotVisible());
                console.log(canLookAt);

                if (itemNotVisible())
                    displayCommand("I don't see any " + lastItemText + " here!");
                else {

                    Array.isArray(itemContains) && itemIsClosed == false ? displayContents() :
                        itemText = itemLookAtText;

                    itemText.nodeName == "UL" ? displayCommand("", itemText) :
                        displayCommand(itemText);
                }
            }
            checkSyntax();
        },

        openObject: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");
            let location = roomCollection[checkLocation()].name;
            let itemLocation = itemCollection[checkItems(lastItemText)].location;
            let canLookAt = checkInteract(lastItemText, "lookAt");
            let itemIndex = itemCollection.findIndex(x => x.name.includes(lastItemText));

            function checkSyntax() {
                lastItem.length === 0 ? displayCommand("what do you want to open?") :
                    checkItem();
            }

            function itemNotVisible() {
                let itemLocationHere;
                let containerLocation;

                for (let i = 0; i < itemCollection.length; i++) {
                    if (itemCollection[i].name.includes(itemLocation))
                        containerLocation = itemCollection[i].location;
                }

                for (let i = 0; i < roomCollection.length; i++) {
                    if (itemLocation == roomCollection[i].name || containerLocation == roomCollection[i].name)
                        itemLocationHere = roomCollection[i].name;
                }
                if (containerLocation == "inventory" || itemLocation == "inventory")
                    itemLocationHere = location;

                console.log("This is the item location either room or item " + itemLocation);
                console.log("This is the container location if an item is inside " + containerLocation);
                console.log("this is the item or container location after evaluation " + itemLocationHere);

                return itemLocationHere != location || !canLookAt ? true : false;
            }

            function checkItem() {
                let canBeOpen = checkInteract(lastItemText, "open");
                let canBeClose = checkInteract(lastItemText, "close");
                let needsKey = hasProperty(itemIndex, "needsKey");

                let openText = itemCollection[itemIndex].openText;

                (itemLocation == location || itemLocation == "inventory") ? itemFound = true:
                    itemFound = false;

                if (itemNotVisible())
                    displayCommand("I don't see any " + lastItemText + " here!");
                else if (!canBeOpen && !canBeClose)
                    displayCommand("you cant open that");
                else if (canBeClose)
                    displayCommand("its already open");
                else {
                    if (needsKey == true)
                        displayCommand(openText);
                    else {
                        if (itemCollection[itemIndex].hasOwnProperty("functionOpen")) {
                            itemCollection[itemIndex].functionOpen();
                            removeInteract("open", itemIndex);
                            addInteract("close", itemIndex);
                            addInteract("seeInside", itemIndex);
                            displayCommand("you open the " + lastItemText);

                            grab(lastItemText);
                            changeText();
                        }
                    }
                }
            }
            checkSyntax();
        },
        closeItem: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");
            let location = roomCollection[checkLocation()].name;
            let canLookAt = checkInteract(lastItemText, "lookAt");
            let itemLocation = itemCollection[checkItems(lastItemText)].location;

            function checkSyntax() {
                lastItem.length === 0 ? displayCommand("what do you want to close?") :
                    checkItem();
            }

            function itemNotVisible() {
                let itemLocationHere;
                let containerLocation;

                for (let i = 0; i < itemCollection.length; i++) {
                    if (itemCollection[i].name.includes(itemLocation))
                        containerLocation = itemCollection[i].location;
                }

                for (let i = 0; i < roomCollection.length; i++) {
                    if (itemLocation == roomCollection[i].name || containerLocation == roomCollection[i].name)
                        itemLocationHere = roomCollection[i].name;
                }
                if (containerLocation == "inventory" || itemLocation == "inventory")
                    itemLocationHere = location;

                console.log("This is the item location either room or item " + itemLocation);
                console.log("This is the container location if an item is inside " + containerLocation);
                console.log("this is the item or container location after evaluation " + itemLocationHere);

                return itemLocationHere != location || !canLookAt ? true : false;
            }

            function checkItem() {
                let canCloseItem = checkInteract(lastItemText, "close");
                let canOpenItem = checkInteract(lastItemText, "open");

                if (itemNotVisible())
                    displayCommand("I don't see any " + lastItemText + " here!");
                else if (!canCloseItem && !canOpenItem)
                    displayCommand("you cant close that");
                else if (canOpenItem)
                    displayCommand("its already closed");
                else {
                    if (itemCollection[checkItems(lastItemText)].hasOwnProperty("functionClose"))
                        itemCollection[checkItems(lastItemText)].functionClose();
                    removeInteract("close", checkItems(lastItemText));
                    removeInteract("seeInside", checkItems(lastItemText));
                    addInteract("open", checkItems(lastItemText));

                    displayCommand("you close the " + lastItemText);

                }

            }
            checkSyntax();

        },
        dropItem: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");

            let location = roomCollection[checkLocation()].name;
            let itemIndex = itemCollection.findIndex(x => x.name.includes(lastItemText));
            console.log(itemIndex);

            function checkSyntax() {
                lastItem.length === 0 ? displayCommand("what do you want to drop?") :
                    checkItem();
            }

            function checkItem() {
                let inInventory = userInventory.indexOf(lastItemText);

                if (inInventory == -1)
                    displayCommand("you don't have that!");
                else {
                    let itemInvIndex = userInventory.indexOf(itemCollection[checkItems(lastItemText)].name[0]);
                    if (userInventory.some(r => itemCollection[itemIndex].name.indexOf(r) >= 0)) {
                        itemCollection[itemIndex].location = location;
                        addInteract("get", checkItems(lastItemText));
                        addInteract("roomLook", checkItems(lastItemText));
                        userInventory.splice(itemInvIndex, 1);
                        displayCommand("you drop the " + lastItemText + " in the " + location);
                    }
                }
            }
            checkSyntax();
        },
        putItemInto: function (lastItem, check) {

            let lastItemText = lastItem.toString().replace(/,/g, "");
            let checked = lastItemText.match(check);
            let item1 = checked[0].toString();
            let item2 = checked[1].toString();
            let itemLocation = itemCollection[checkItems(item1)].location;
            let itemLocationSecond = itemCollection[checkItems(itemLocation)].location;
            let item1Index, item2Index, item2Capacity, item1Size, item1InInventory, item1LookAt, itemInvIndex, item2IsClosed;
            let item1Name = "",
                item2Name = "";

            if (itemLocationSecond != "dummy") itemLocation = itemLocationSecond;
            itemCollection.forEach(function (e, i) {
                let checkAgainst = itemCollection[i].name[itemCollection[i].name.length - 1];
                if (checkAgainst.test(item1)) {

                    item1Index = i;
                    item1Name = itemCollection[item1Index].name[1];
                    item1Size = itemCollection[item1Index].size;
                    item1InInventory = userInventory.includes(itemCollection[item1Index].name[0]);
                    item1LookAt = itemCollection[item1Index].possibleInteract.includes("lookAt");

                    console.log(item1InInventory);
                }

            });
            itemCollection.forEach(function (e, i) {
                let checkAgainst = itemCollection[i].name[itemCollection[i].name.length - 1];
                if (checkAgainst.test(item2)) {

                    item2Index = i;
                    item2Name = itemCollection[item2Index].name[1];
                    item2Capacity = itemCollection[item2Index].capacity;
                    item2IsClosed = itemCollection[item2Index].possibleInteract.includes("open");
                    console.log(item2Capacity);
                }

            });

            console.log(item1Name + item2Name);
            console.log(itemCollection[item1Index]);
            console.log(item1LookAt);
            console.log(itemLocation);

            function checkSyntax() {
                if (item1LookAt == false)
                    displayCommand("You don't have that!");
                else if (item1InInventory == false)
                    displayCommand("You don't have the " + item1Name);
                else if (item2Capacity == undefined)
                    displayCommand("you can't do that.");
                else if (item2IsClosed == true)
                    displayCommand("The " + item2Name + " isn't open");
                else {
                    itemCollection[item2Index].capacity[1] = itemCollection[item2Index].capacity[1] += item1Size;
                    if (itemCollection[item2Index].capacity[1] > itemCollection[item2Index].capacity[0]) {
                        displayCommand("There's no room.")
                        itemCollection[item2Index].capacity[1] = itemCollection[item2Index].capacity[1] -= item1Size;
                        console.log(itemCollection[item2Index].capacity[1]);
                    } else {
                        itemCollection[item1Index].location = itemCollection[item2Index].name[0];
                        itemInvIndex = userInventory.indexOf(itemCollection[item1Index].name[0]);
                        userInventory.splice(itemInvIndex, 1);
                        itemCollection[item2Index].contains.push(itemCollection[item1Index].name[0]);
                        addInteract("roomLook", item1Index);
                        addInteract("get", item1Index);
                        displayCommand("Done.");
                        console.log(itemCollection[1]);
                    }
                }
            }
            checkSyntax();
        },
        moveItemTo: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");
            let location = roomCollection[checkLocation()].name;
            let canLookAt = checkInteract(lastItemText, "lookAt");
            let itemLocation = itemCollection[checkItems(lastItemText)].location;
            let itemIndex = itemCollection.findIndex(x => x.name.includes(lastItemText));

            console.log(lastItem);

            function checkSyntax() {
                lastItem.length === 0 ? displayCommand("what do you want to move?") :
                    checkItem();
            }

            function itemNotVisible() {
                let itemLocationHere;
                let containerLocation;

                for (let i = 0; i < itemCollection.length; i++) {
                    if (itemCollection[i].name.includes(itemLocation))
                        containerLocation = itemCollection[i].location;
                }

                for (let i = 0; i < roomCollection.length; i++) {
                    if (itemLocation == roomCollection[i].name || containerLocation == roomCollection[i].name)
                        itemLocationHere = roomCollection[i].name;
                }
                if (containerLocation == "inventory" || itemLocation == "inventory")
                    itemLocationHere = location;

                console.log("This is the item location either room or item " + itemLocation);
                console.log("This is the container location if an item is inside " + containerLocation);
                console.log("this is the item or container location after evaluation " + itemLocationHere);

                return itemLocationHere != location || !canLookAt ? true : false;
            }

            function checkItem() {
                let text;
                let moveText = hasProperty(itemIndex, "moveText");
                let moveTextStatic = hasProperty(itemIndex, "moveTextStatic");
                let canMoveItem = checkInteract(lastItemText, "move");

                console.log(moveText);
                console.log(moveTextStatic);

                if (itemLocation == "inventory")
                    displayCommand("You aren't an accomplished enough juggler.");
                else if (itemNotVisible())
                    displayCommand("I don't see any " + lastItemText + " here!");
                else if (canMoveItem == false)
                    displayCommand("That would accomplish nothing");
                else {

                    if (moveTextStatic != "false")
                        text = moveTextStatic;
                    else if (moveText != "false") {
                        text = moveText;
                        removeInteract("move", itemIndex);
                        grab(lastItemText);
                        changeText();
                    }

                    displayCommand(text);
                }
            }
            checkSyntax();
        },
        unlockItem: function (lastItem) {
            let lastItemText = lastItem.toString().replace(/,/g, " ");
            let location = roomCollection[checkLocation()].name;

            function checkSyntax() {
                lastItem.length === 0 ? displayCommand("what do you want to unlock?") :
                    checkItem();
            }

            function checkItems() {




            }

            checkSyntax()

        },
    };

    function checkLocation() {
        for (let i = 0; i < roomCollection.length; i++) {
            if (userLocation == roomCollection[i].name) return i;
        }
    }

    function pushItem(commandArray, lastItem = []) {
        commandArray.forEach(function (e, i) {
            if (items.includes(e))
                lastItem.push(e);
            console.log(lastItem);
        });
    }

    var commandChecker = {

        syntax: function () {

            let commandString = userCommands.toString().replace(/,/g, " ");
            let commandTestString = commandString.replace(/ /g, "");
            let lastItem = [];
            let check = "";
            let Lookfor;
            pushItem(userCommands, lastItem);
            console.log(lastItem);

            let lastItemText = lastItem.toString().replace(/,/g, " ");

            const commandLines = function () {

                let itemChecked;

                itemCollection.forEach(function (e, i) {
                    let checkAgainst = e.name[e.name.length - 1];
                    check = check.concat(checkAgainst);
                });

                check = check.replace(/\/g\/|\/g|\//g, '|').replace(/\|$/, '').replace(/\/|/, "/");
                check = new RegExp(check, "g");


                console.log(check);

                function test(item) {
                    let itemNoSpace = item.replace(/ /g, "");
                    if (itemNoSpace.length > 0) {
                        if (itemChecked = itemNoSpace.match(check)) {
                            return itemChecked[0];
                        } else
                            return null;
                    }
                }

                function test2(item) {
                    let itemNoSpace = item.replace(/ /g, "");
                    if (itemNoSpace.length > 0) {
                        if (itemChecked = itemNoSpace.match(check))
                            return itemChecked[1];
                        else
                            return null;
                    }
                }

                const lines = {
                    lookAround: /^look$|^l$/,
                    directions: /^go[nesw]?$|^walk[nesw]?$|^run[nesw]?$|^north$|^east$|^south$|^west$|^n*$|^e*$|^s*$|^w*$/,
                    getItem: new RegExp("^pick(" + test(lastItemText) + ")up$|^pickup(the)?(" + test(lastItemText) + ")?$", "g"),
                    //other get commands are take,get
                    putDownItem: new RegExp("^drop(the)?(" + test(lastItemText) + ")?$|^drop(" + test(lastItemText) + ")?(here)?$|^dropthe(" + test(lastItemText) + ")here", "g"),
                    //other drop commands are leave,release,put down,
                    lookAtItem: new RegExp("^lookat(the)?(" + test(lastItemText) + ")?$|^examine(the)?(" + test(lastItemText) + ")?$|^inspect(the)?(" + test(lastItemText) + ")?$", "g"),
                    openItem: new RegExp("^open(the)?(" + test(lastItemText) + ")?$", "g"),
                    closeItem: new RegExp("^close(the)?(" + test(lastItemText) + ")?$", "g"),
                    moveItem: new RegExp("^move(the)?(" + test(lastItemText) + ")?$", "g"),
                    putItemIn: new RegExp("^put(the)?(" + test(lastItemText) + ")in(the)?(" + test2(lastItemText) + ")$", "g"),
                    unlock: new RegExp("^unlock(the)?(" + test(lastItemText) + ")with(the)?(" + test2(lastItemText) + ")$", "g"),
                };

                for (const property in lines) {
                    if (lines[property].test(commandTestString) == true) {

                        Lookfor = property;
                    }
                }
                console.log(lines.putItemIn);

            };

            commandLines();

            let commandSearch = (({
                lookAround: () => roomCommands.lookAround(),
                lookAtItem: () => roomCommands.lookAtObjects(lastItem),
                directions: () => {
                    roomCommands.moveCharacterTo(userCommands);
                },
                getItem: () => roomCommands.getObject(lastItem),
                openItem: () => roomCommands.openObject(lastItem),
                closeItem: () => roomCommands.closeItem(lastItem),
                putDownItem: () => roomCommands.dropItem(lastItem),
                putItemIn: () => roomCommands.putItemInto(lastItem, check),
                moveItem: () => roomCommands.moveItemTo(lastItem),
                unlock: () => roomCommands.unlockItem(lastItem),
            })[Lookfor] || (() => displayCommand("that command does not make sense to me")))();
        }
    };
    commandChecker.syntax();
}

function isCommandValid(userCommands, validUserInputs, commandList) {
    /*checks commands, if its an interce command run here with function in check commands, if its not an interface command it is valid but it must be a room command we need to check the rooms -SEE NOTE 3-*/

    let store = "";
    for (var i = 0; i < commandList.length; i++) {
        if (commandList[i].interfaceCommand.includes(userCommands[0])) {
            store = (commandList[i].display);
        }

    }
    if (store && userCommands.length == 1)
        store();
    else
        commandList[5].collect();
}

function checkCommands(userCommands) {

    //A comman list object array of usable commands
    var commandList = [
        {
            interfaceCommand: ["about", "info"],
            display: () => displayCommand("adventure game test room with one room to escape from. copywrite: Mark Ikin 2020")
        },
        {
            interfaceCommand: ["commands", "help"],
            display: () => displayCommand("here is some useful information about the game and commands")
        },
        {
            interfaceCommand: ["save"],
            display: () => displayCommand("you can save someday but not today")
        },
        {
            interfaceCommand: ["load", "restore"],
            display: () => displayCommand("you can load maybe")
        },
        {
            interfaceCommand: ["inventory", "inv"],
            display: () => {
                console.log("this is the function");
                if (userInventory.length === 0)
                    displayCommand("You are empty-handed.");
                else {
                    let text = document.createTextNode("You are carrying:");
                    let textNode = document.createElement("li");
                    textNode.appendChild(text);
                    let ulNode = document.createElement("ul");
                    ulNode.appendChild(textNode);
                    ulNode.className = "insideUL";

                    userInventory.forEach(function (e, i) {
                        itemCollection.forEach(function (element, index) {

                            if (itemCollection[index].name[0].includes(e)) {
                                let textNodeInner = document.createElement("li");
                                let textInner = document.createTextNode("A " + itemCollection[index].name[0]);
                                textNodeInner.appendChild(textInner);
                                ulNode.appendChild(textNodeInner);
                            }
                        });
                    });
                    displayCommand("", ulNode);
                }
            }
        },
        {

            interfaceCommand: ["look", "l", //look at room
                               "north", "east", "south", "west", "n", "e", "s", "w", //move room
                               "walk", "go", "run", // move preproposition
                                "examine", "inspect", //examine items
                               "the", // the keyword
                               "at", // at keyword
                               "look", //look keyword
                               "open", // open keyword
                               "close", // close keyword
                               "get", "pick", "up", "turn", "with", //get keywords
                               "drop", "put", "down", "release", "leave", // drop item keywords
                               "here", //here keyword
                               "in", // in keyword
                               "move",
                               "unlock",
                               "with",
                               "sack", "garlic", "bottle", "water", "lunch", "table", "elongated", "brown", "glass", "quantity", "of", "screw", "screwdriver", "clove", "picture", "painting", "paper", "safe", "metal"], //items

            collect: function () {
                var items = this.interfaceCommand.slice(35, 55);

                if (this.interfaceCommand.includes(userCommands[0])) {
                    roomInterface(userCommands, items);
                    console.log(userCommands);
                    console.log(items);
                } else
                    displayCommand("that command does not make sense to me");
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
        //interfaceCommandsArray = interfaceCommandsArray.concat(items);
        console.log(interfaceCommandsArray);

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
    var showUserInput;
    var userInput;

    var pUserInput = document.createElement("pre");
    pUserInput.className = "userInput";

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
        userInput.length === 0 ? displayCommand("Pardon!") : checkCommands(userInput);
    }
    /////////////////////////////////////////////////////////

    if (event.keyCode === 13) {
        setStartElement(); /*sets margin bottom when first input activted. only for presentaton consitency see ONCE.JS*/
        event.preventDefault();
        userInput = input.value;
        showUserInput = input.value;
        userInput = userInput.trim().toLowerCase().split(" ").filter(function (element) {
            return element != '';
        });

        pUserInput.append("\x3e\x3e\xa0\xa0" + showUserInput);
        displayArea.append(pUserInput);
        checkIsEmpty();
        input.value = "";
        deleteInput();
    }
}
input.addEventListener("keydown", getUserInput);
