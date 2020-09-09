//function grab (index){
//    itemIndex = index;
//}

function once(fn, context) {
    var result;

    return function () {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }

        return result;
    };
}

//var setStartElement = once(function () {
//    console.log("yes or no ?");
//    var i = document.getElementsByClassName("userInput");
//    i[0].style.marginBottom = "25px";
//    i[0].style.color = "#FFF";
//});

var changeTextOnce = once(function (itemIndex) {
    if (itemCollection[itemIndex].hasOwnProperty("changeTextOnce"))
        itemCollection[itemIndex].changeTextOnce();
});
