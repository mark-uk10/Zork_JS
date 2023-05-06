
const synonym ={
    words: ["look","l","stare","gaze","pour","spill"],
    look: "(look|l|stare|gaze)",
    pour: "(pour|spill)",
        }
const preposition = {
    words: ["the","at","in","from","on","under","inside","behind","around","with"]
}
const movement ={
    words: ["n","e","s","w","north","east","south","west","up","down"]
}

const testObjects = {
    words: ["water","bottle"]
  }

const reg = function(expression){
    return new RegExp(`^${expression}$`)
}

const collectVerbs = () =>
    new Set([...synonym.words,...preposition.words,...movement.words,...testObjects.words]);
  
const syntax = [
    {
        lookSyntax:{ 
            look: reg(`look`),
            lookAround: reg(`${synonym.look}around(?<object>.*)`),
            lookUp: reg(`${synonym.look}up(?<object>.*)`),
            lookDown: reg(`${synonym.look}down(?<object>.*)`),
            f_reference: "f_look",
        },
        lookAtSyntax:{
            examine: reg(`${synonym.look}at((the|an|a)?(?<object>.*))?`),
            f_reference: "f_examine"
        },
        lookOnSyntax:{
            lookOn: reg(`${synonym.look}on(?<object>.*)`),
            f_reference: "f_lookOn"
        },
        lookInSyntax:{
            lookWith: /^lookwith(?<object>.*)$/,
            lookIn: /^lookin(?<object>.*)$/,
            f_reference: "f_lookInside"
        },
        lookUnderSyntax:{
            lookUnder: /^lookunder(?<object>.*)$/,
            f_reference: "f_lookUnder"
        },
        lookBehindSyntax:{
            lookBehind: /^lookbehind(?<object>.*)$/,
            f_reference: "f_lookBehind"
        },
        lookForSyntax:{
            find: /^lookfor(?<object>.*)$/,
            f_reference: "f_find"
        },
    },
    {
        pourSyntax:{
            pourIn: /^pour(?<object>.*)in(?<indirectObject>.*)$/,
            pourFrom: /^pour(?<object>.*)from(?<indirectObject>.*)$/,
            pour:/^pour(?<object>.*)$/,
            f_reference: "f_drop"
        },
        pourOnSyntax:{
            pourOn: /^pour(?<object>.*)on(?<indirectObject>.*)$/,
            f_reference: "f_pourOn"
        }
    },
    {
        onlyObject:{
            object:/^(?<object>.*)$/,
            f_reference: "f_no_verb"
        }
    }
    ]

    export{syntax,collectVerbs}