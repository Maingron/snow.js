// snow.js 2.0-dev by Maingron (https://maingron.com/snowjs)
// Licensed under MIT (https://github.com/Maingron/snow.js/blob/master/LICENSE)

// Snow.js is a JavaScript library for creating snow effects on web pages.
// It is designed to be lightweight and easy to use.

// snow.js config object

(function() {
    const config = {
        // Basic settings
        snowChars: ["*"],
        snowOpacity: 0.75,
        tickTime: (1000/60), // ms - time between render steps - low values might show varying results in different browsers
        maxSnow: window.innerHeight / 8, // Max amount of snowflakes
        jitterAmount: 2,
        gravityAmount: 3,
        initialYSpacing: -window.innerHeight - 200, // px - -window.innerHeight makes the snowflakes spawn across the entire screen so they don't need to fall from the top first
        offsetTop: -100, //px
        offsetBottom: 100, //px
        snowSizes: ["20px","25px","35px","40px"],
        snowColors: ["#fff","#fff","#edf"],
        snowFont: "inherit", // CSS - Uses the same font as the parent container by default - alternative example: "'Tahoma', 'Arial', sans-serif"
    
        // Advanced settings
        snowContainer: document.body,
        cssTransition: 0, // seconds; not recommended
        autoFixScriptTag: false, // Recommended: true. If true, make sure the snow.js file is called snow.js or snow.min.js. Might not have a big effect.
        maxDecimalLength: 1, // 0.123456789
        snowflakeTagName: "i",
        snowflakeClassName:"s"
    };



    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)"); // check if user prefers reduced motion

    var snowflakes = [];

    if(config.autoFixScriptTag) {
        var scriptElementsOnPage = document.getElementsByTagName("script");
        var scriptElementOfSnowjs = undefined;
        for(var i = 0; scriptElementsOnPage.length > i; i++) {
            if(scriptElementsOnPage[i] && scriptElementsOnPage[i].getAttribute("src")) {
                if(scriptElementsOnPage[i].getAttribute("src").indexOf("snow.js") > -1 || scriptElementsOnPage[i].getAttribute("src").indexOf("snow.minjs") > -1) {
                    scriptElementOfSnowjs = scriptElementsOnPage[i];
                    break;
                }
            }
        }

        if(!scriptElementOfSnowjs) {
            console.warn("snow.js is not called snow.js or snow.min.js - config.autoFixScriptTag was ignored and set to false.");
            config.autoFixScriptTag = false;
        } else {
            scriptElementOfSnowjs.setAttribute("async",true);
            scriptElementOfSnowjs.setAttribute("charset","UTF-8");
        }
    }


    // style snow

    addElement("style", document.body, "snowstyle");
    document.getElementsByClassName("snowstyle")[0].innerHTML = `
        .${config.snowflakeClassName} {
            position:fixed;
            display:inline;
            height:0;
            width:0;
            overflow:visible;
            top:-50px;
            font-family: ${config.snowFont};
            transition : ${config.cssTransition}s;
            opacity: ${config.snowOpacity};
            font-style: normal;
            pointer-events: none;
        }

        @media(prefers-reduced-motion:reduce) {
            .${config.snowflakeClassName} {
                display:none;
            }
        }
    `;



    // Functions


    function initSnow() {
        if(snowflakes == 0) { // if not already initialized
            for (var i = 0; i < config.maxSnow; i++) {
                // create and index snowflakes
                snowflakes[i] = addElement(config.snowflakeTagName, config.snowContainer, config.snowflakeClassName);
            }

            for (var i = 0; i < config.maxSnow; i++) {
                snowflakes[i].top = 0 + config.offsetTop + -snowRound(snowRandom(config.initialYSpacing));
            }

            window.setInterval(function () {
                if(prefersReducedMotion.matches) {
                    return; // Don't calculate snow - It's hidden because the user prefers reduced motion
                }

                for (var i = 0; i < snowflakes.length; i++) {
                    tpSnowFlake(snowflakes[i]);
                }
            }, config.tickTime);
        }

        for (var i = 0; i < config.maxSnow; i++) {
            snowflakes[i].left = snowRound((window.innerWidth / config.maxSnow) * i); // set initial position left
        }
    }


    function addElement(which, where, className) {
        which = document.createElement(which);
        where = document.body;
        if (className) {
            if (className == config.snowflakeClassName) {
                which.innerHTML = config.snowChars[snowRandom(config.snowChars.length,1)];
                which.style.top = 0;
                which.style.color = config.snowColors[snowRandom(config.snowColors.length,1)];
                which.style.fontSize = config.snowSizes[snowRandom(config.snowSizes.length,1)];
            }
            which.classList.add(className);
        }
        where.appendChild(which);

        which.top = config.top

        return which;
    }


    function snowRandom(max,roundType) {
        if(!roundType) {
            return((Math.random() * max));
        } else if(roundType == 1 || roundType == "floor") {
            return(Math.floor((Math.random() * max)));
        }
    }


    function snowRound(which) {
        return(+which.toFixed(config.maxDecimalLength));
    }


    function tpSnowFlake(which) {
        // TP if out of bounds
        if(config.gravityAmount < 0) { // Gravity is negative
            if (which.top < 0 + config.offsetTop) {
                which.top = window.innerHeight + config.offsetBottom;
            }

        } else if(config.gravityAmount > 0) { // Gravity is positive
            if(which.top > window.innerHeight + config.offsetBottom) {
                which.top = 0 + config.offsetTop;
            }
        }

        // Do gravity
        which.top += snowRound(snowRandom(config.gravityAmount));
        which.style.top = which.top + "px";

        // Do jitter
        which.left += snowRound(snowRandom(config.jitterAmount)) - (config.jitterAmount / 2);
        which.style.left = which.left + "px";
    }



    // add event listeners

    addEventListener("load",function() {
        initSnow();
    });

    addEventListener("resize",function() {
        initSnow();
    });

    prefersReducedMotion.addEventListener("change",function() {
        initSnow();
    });
})();
