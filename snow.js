if(!data) {
    var data = d = {};
}

data["snow"] = {
    "config": {},
    "data": {},
    "elements": {}
}
var snow = data["snow"];

snow.config = {
    "snowChars": ["*"],
    "tickTime": 17, // ms - time between render steps - low values might vary in browsers
    "maxSnow": window.innerHeight / 8, // Max amount of snowflakes
    "jitterAmount": 2,
    "gravityAmount": 3,
    "initialYDistance": window.innerHeight + 80, // px
    "snowSizes": ["15px", "20px", "25px","30px","35px","40px","45px"],
    "snowColors": ["#fff","#fff","#fff","#fff","#fff","#fff","#99f","#f99","#edf","#afa"],
    "snowFont": "Calibri, Arial, Tahoma, 'Comic Sans MS', sans-serif", // Uses CSS - If first font is not available, the second one is being used...

    // Advanced settings
    "snowContainer": document.body,
    "cssTransition": 0, //seconds; not recommended
    "autoFixScriptTag": false, // Recommended: true. If true, make sure the snow.js file is called snow.js or snow.min.js. Might not have a big effect.
    "maxDecimalLength": 1, // 0.123456789
    "snowflakeTagName": "i",
    "snowflakeClassName":"s"
}

if(snow.config.autoFixScriptTag) {
    snow.elements.scripts = document.getElementsByTagName("script");
    for(var i = 0; snow.elements.scripts.length > i; i++) {
        if(snow.elements.scripts[i] && snow.elements.scripts[i].getAttribute("src")) {
            if(snow.elements.scripts[i].getAttribute("src").indexOf("snow.js") > -1 || snow.elements.scripts[i].getAttribute("src").indexOf("snow.minjs") > -1) {
                snow.elements.script = snow.elements.snowScript = snow.elements.scripts[i];
                break;
            }
        }
    }

    if(!snow.elements.script) {
        console.warn("snow.js is not called snow.js or snow.min.js - snow.config.autoFixScriptTag was ignored and set to false.");
        snow.config.autoFixScriptTag = false;
    } else {
        snow.elements.script.setAttribute("async",true);
        snow.elements.script.setAttribute("charset","UTF-8");
    }
}

addElement("style", document.body, "snowstyle");
document.getElementsByClassName("snowstyle")[0].innerHTML = `
.`+snow.config.snowflakeClassName+` {
    position:fixed;
    display:inline;
    height:0;
    width:0;
    overflow:visible;
    top:-50px;
    font-family: `+snow.config.snowFont+`;
    transition :`+snow.config.cssTransition+`s;
    font-style: normal;
    pointer-events: none;
}
`;

function initSnow() {
    if(!snow.elements.snowflakes) {
        for (var i = 0; i < snow.config.maxSnow; i++) {
            addElement(snow.config.snowflakeTagName, snow.config.snowContainer, snow.config.snowflakeClassName);
        }
        snow.elements.snowflakes = document.getElementsByClassName(snow.config.snowflakeClassName);
    }

    for (var i = 0; i < snow.config.maxSnow; i++) {
        snow.elements.snowflakes[i].left = round((window.innerWidth / snow.config.maxSnow) * i); // set initial position left
        snow.elements.snowflakes[i].top = -round(random(snow.config.initialYDistance));
    }
}


window.setInterval(function () {
    for (var i = 0; i < snow.elements.snowflakes.length; i++) {
        if (snow.elements.snowflakes[i].top < window.innerHeight) {
            snow.elements.snowflakes[i].top += round(random(snow.config.gravityAmount));
            snow.elements.snowflakes[i].style.top = snow.elements.snowflakes[i].top + "px";
        } else {
            snow.elements.snowflakes[i].top = -60;
        }
        snow.elements.snowflakes[i].left += round(random(snow.config.jitterAmount)) - (snow.config.jitterAmount / 2); // add jitter
        snow.elements.snowflakes[i].style.left = snow.elements.snowflakes[i].left + "px";
    }
}, snow.config.tickTime);


function addElement(which, where, className) {
    which = document.createElement(which);
    where = document.body;
    if (className) {
        if (className == snow.config.snowflakeClassName) {
            which.innerHTML = snow.config.snowChars[random(snow.config.snowChars.length,1)];
            which.style.top = 0;
            which.style.color = snow.config.snowColors[random(snow.config.snowColors.length,1)];
            which.style.fontSize = snow.config.snowSizes[random(snow.config.snowSizes.length,1)];
        }
        which.classList.add(className);
    }
    where.appendChild(which);
}

function random(max,roundType) {
    if(!roundType) {
        return((Math.random() * max));
    } else if(roundType == 1 || roundType == "floor") {
        return(Math.floor((Math.random() * max)));
    }
}

function round(which) {
    return(+which.toFixed(snow.config.maxDecimalLength));
}


initSnow();

addEventListener("resize",function() {
    initSnow();
})