// snow.js by Maingron (https://maingron.com/snowjs)
// Licensed under MIT (https://github.com/Maingron/snow.js/blob/master/LICENSE)

if(!data) {
    var data = d = {};
}

if(!data["snow"]) {
    data["snow"] = {
        "config": {},
        "data": {},
        "elements": {}
    }
}

if(!snow) {
    var snow = data["snow"];
}

snow.config = {
    "snowChars": ["*"],
    "tickTime": 16.66, // ms - time between render steps - low values might show varying results in different browsers
    "maxSnow": window.innerHeight / 8, // Max amount of snowflakes
    "jitterAmount": 2,
    "gravityAmount": 3,
    "initialYSpacing": -window.innerHeight - 200, // px - -window.innerHeight makes the snowflakes spawn across the entire screen so they don't need to fall from the top first
    "topBorder": -100, //px
    "bottomBorder": window.innerHeight + 100, //px
    "snowSizes": ["20px","25px","35px","40px"],
    "snowColors": ["#fff","#fff","#edf"],
    "snowFont": "'Calibri', 'Arial', 'Tahoma', sans-serif", // Uses CSS - If first font is not available, the second one is being used...

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

        for (var i = 0; i < snow.config.maxSnow; i++) {
            snow.elements.snowflakes[i].top = snow.config.topBorder + -round(random(snow.config.initialYSpacing));
        }
    }

    for (var i = 0; i < snow.config.maxSnow; i++) {
        snow.elements.snowflakes[i].left = round((window.innerWidth / snow.config.maxSnow) * i); // set initial position left
    }
}


window.setInterval(function () {
    for (var i = 0; i < snow.elements.snowflakes.length; i++) {
        if (snow.elements.snowflakes[i].top < snow.config.bottomBorder) {
            snow.elements.snowflakes[i].top += round(random(snow.config.gravityAmount));
            snow.elements.snowflakes[i].style.top = snow.elements.snowflakes[i].top + "px";
        } else {
            snow.elements.snowflakes[i].top = snow.config.topBorder;
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

addEventListener("load",function() {
    initSnow();
});


addEventListener("resize",function() {
    initSnow();
})