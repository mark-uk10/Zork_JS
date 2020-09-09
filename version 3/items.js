const itemCollection = [
    {
        name: ["sack", "brownsack", "elongatedbrownsack", "elongatedsack"],
        displayName: "brown sack",
        //defaultLook: "on the table is an elongated brown sack, smelling of hot peppers",
        look: "A brown sack is here",
        lookAt: "The brown sack is closed",
        containText: "The brown sack contains:",
        contains: ["lunch", "garlic"],
        openText: "opening the brown sack reveals a garlic and a lunch",
        location: "table",
        possibleInteract: ["roomLook", "open", "lookAt", "get"],
        size: 3,
        capacity: [3, 2],

        isUsed: function () {
            delete this.defaultLook;
        },
        changeTextOnce: function () {
            this.isUsed();
            this.openText = "you open the sack";
        },
        changeTextLookAtFromClose: function () {
            this.lookAt = "The brown sack is closed";
        },
        changeTextFromDrop: function () {
            this.isUsed();
            if (this.location == userData.location)
                this.look = ("There is a brown sack here")
            else
                this.look = ("A brown sack")
        },
        openAlways: function () {
            this.isUsed();
            itemCollection.forEach((e) => {
                if (e.name.some(r => this.contains.indexOf(r) >= 0))
                    e.possibleInteract = ["lookAt", "roomLook", "get"];
            });
        },
        closeAlways: function () {
            itemCollection.forEach((e) => {
                if (e.name.some(r => this.contains.indexOf(r) >= 0))
                    e.possibleInteract = [];
            });
        },

    },
    {
        name: ["bottle", "glassbottle"],
        location: "table",
        displayName: "glass bottle",
        containText: "The glass bottle contains:",
        look: "A glass bottle is here",
        //defaultLook: "A glass bottle is sitting on the table",
        openText: "you open the bottle",
        contains: ["water"],
        possibleInteract: ["roomLook", "lookAt", "seeInside", "get","open"],
        size: 2,


        isUsed: function () {
            delete this.defaultLook;
        },
        changeTextFromDrop: function () {
            this.isUsed();
            if (this.location == userData.location)
                this.look = ("There is a glass bottle here")
            else
                this.look = ("A glass bottle")
        },


    },
    {
        name: ["picture", "painting", "oldpainting"],
        location: "kitchen",
        look: "A painting of an old man is hanging on the wall",
        displayName: "old painting",
        possibleInteract: ["roomLook"],
        contains: [],
    },
    {
        name: ["table"],
        location: "kitchen",
        displayName: "table",
        containText: "sitting on the kitchen table is:",
        contains: [ "sack","bottle"],
        possibleInteract: ["lookAt", "seeInside", "roomLook"],
        capacity: [99, 5]
    },
    {
        name: ["sofa"],
        location: "kitchen",
        displayName: "sofa",
        containText: "sitting on the sofa is:",
        contains: [],
        possibleInteract: ["lookAt", "seeInside", "roomLook"],
    },
    {
        name: ["garlic", "clove", "garlicclove", "cloveofgarlic"],
        location: "sack",
        look: "A clove of garlic",
        displayName: "garlic",
        possibleInteract: ["roomLook"],
        size:1,
    },
    {
        name: ["lunch"],
        location: "sack",
        look: "a tasty lunch",
        displayName: "lunch",
        possibleInteract: ["roomLook"],
        size:1,
    },
    {
        name: ["safe", "metalsafe"],
        location: "corridor",
        displayName: "metal safe",
        possibleInteract: [],
        capacity: [10,0]
    },
    {
        name: ["water", "quantityofwater"],
        location: "bottle",
        look: "quantity of water",
        displayName: "quantity of water",
        possibleInteract: ["roomLook"],
    },
    {
        name: ["key", "metalkey"],
        location: "bedroom",
        displayName: "key",
        possibleInteract: [],
        size: 1,
    },


]
