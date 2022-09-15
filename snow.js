// snow.js 1.1-dev by Maingron (https://maingron.com/snowjs)
// Licensed under MIT (https://github.com/Maingron/snow.js/blob/master/LICENSE)

if(!data) {
    var data = {};
    var d = data;
}

if(!data["snow"]) {
    data["snow"] = {
        "config": {},
        "data": {},
        "functions": {},
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


snow.functions.addElement = function(which, where, className) {
    which = document.createElement(which);
    where = document.body;
    if (className) {
        if (className == snow.config.snowflakeClassName) {
            which.innerHTML = snow.config.snowChars[snow.functions.random(snow.config.snowChars.length,1)];
            which.style.top = 0;
            which.style.color = snow.config.snowColors[snow.functions.random(snow.config.snowColors.length,1)];
            which.style.fontSize = snow.config.snowSizes[snow.functions.random(snow.config.snowSizes.length,1)];
        }
        which.classList.add(className);
    }
    where.appendChild(which);
}

snow.functions.random = function(max,roundType) {
    if(!roundType) {
        return((Math.random() * max));
    } else if(roundType == 1 || roundType == "floor") {
        return(Math.floor((Math.random() * max)));
    }
}

snow.functions.round = function(which) {
    return(+which.toFixed(snow.config.maxDecimalLength));
}


snow.data.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)");

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

snow.functions.addElement("style", document.body, "snowstyle");
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

    @media(prefers-reduced-motion:reduce) {
        .`+snow.config.snowflakeClassName+` {
            display:none;
        }
    }
`;

snow.functions.initSnow = function() {
    if(!snow.elements.snowflakes) {
        for (var i = 0; i < snow.config.maxSnow; i++) {
            snow.functions.addElement(snow.config.snowflakeTagName, snow.config.snowContainer, snow.config.snowflakeClassName);
        }
        snow.elements.snowflakes = document.getElementsByClassName(snow.config.snowflakeClassName);

        for (var i = 0; i < snow.config.maxSnow; i++) {
            snow.elements.snowflakes[i].top = snow.config.topBorder + -snow.functions.round(snow.functions.random(snow.config.initialYSpacing));
        }

        window.setInterval(function () {
            if(snow.data.prefersReducedMotion.matches) {
                return; // Don't calculate snow - It's hidden because the user prefers reduced motion
            }

            for (var i = 0; i < snow.elements.snowflakes.length; i++) {
                tpSnowFlake(snow.elements.snowflakes[i]);
            }
        }, snow.config.tickTime);


    }

    for (var i = 0; i < snow.config.maxSnow; i++) {
        snow.elements.snowflakes[i].left = snow.functions.round((window.innerWidth / snow.config.maxSnow) * i); // set initial position left
    }
}

function tpSnowFlake(which) {
    // TP if out of bounds
    if(snow.config.gravityAmount < 0) { // Gravity is negative
        if (which.top < snow.config.topBorder) {
            which.top = snow.config.bottomBorder;
        }

    } else if(snow.config.gravityAmount > 0) { // Gravity is positive
        if(which.top > snow.config.bottomBorder) {
            which.top = snow.config.topBorder;
        }
    }


    // Do gravity
    which.top += snow.functions.round(snow.functions.random(snow.config.gravityAmount));
    which.style.top = which.top + "px";


    // Do jitter
    which.left += snow.functions.round(snow.functions.random(snow.config.jitterAmount)) - (snow.config.jitterAmount / 2);
    which.style.left = which.left + "px";
}

addEventListener("load",function() {
    snow.functions.initSnow();
});

addEventListener("resize",function() {
    snow.functions.initSnow();
});

snow.data.prefersReducedMotion.addEventListener("change",function() {
    snow.functions.initSnow();
});