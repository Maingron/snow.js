// snow.js 2.0.0-dev by Maingron (https://maingron.com/snowjs)
// Licensed under MIT (https://github.com/Maingron/snow.js/blob/master/LICENSE)

// Snow.js is a standalone JavaScript library for creating snow effects on web pages.
// It is designed to be lightweight and easy to use.


(function() {
    // CONFIGURATION //
    let config = {
        // Basic settings
        enable: true, // [boolean] Enable snow (default: true)
        snowChars: ["*"], // [array] Characters to use for snowflakes (default:["*"]) (e.g. ["*", "❅", "❆"])
        snowOpacity: 0.75, // [number 0-1] Opacity of snowflakes (default:0.75) (0 = transparent, 1 = opaque)
        tickTime: (1000/60), // [number] Time between each tick in milliseconds (default: 1000/60) (higher = slower) (1000/60 = 60fps; 1000/30 = 30fps)
        maxSnow: window.innerHeight / 8, // [number] Maximum number of snowflakes to render at once (default: window.innerHeight / 8)
        jitterAmount: 2, // [number] Amount of jitter to apply to snowflakes each tick (default: 2)
        gravityAmount: 3, // [number] Amount of gravity to apply to snowflakes each tick (default: 3)
        initialYSpacing: -window.innerHeight - 200, // [number] Initial Y spacing in px for snowflakes (default: -window.innerHeight - 200) "-window.innerHeight" makes the snowflakes spawn across the entire screen
        offsetTop: -100, // [number] Offset top in px for snowflakes (default: -100)
        offsetBottom: 100, // [number] Offset bottom in px for snowflakes (default: 100)
        snowSizes: ["20px","25px","35px","40px"], // [array] Sizes of snowflakes (default: ["20px","25px","35px","40px"])
        snowColors: ["#fff","#fff","#edf"], // [array] Colors of snowflakes (default: ["#fff","#fff","#edf"])
        snowFont: "inherit", // [string] (CSS) Font of snowflakes (default: "inherit") (e.g. "Arial", "Times New Roman", sans-serif)
    
        // Advanced and experimental settings
        snowContainer: document.body, // [object] Container to render snowflakes in (default: document.body)
        cssTransition: 0, // [number] CSS transition time in seconds (default: 0) (0 = no transition)
        autoFixScriptTag: false, // [boolean] Automatically fix some script tag attributes (default: false) 
        maxDecimalLength: 1, // [number] Maximum decimal length for snowflake positions (default: 1) (higher = more accurate but slower) (0.123456789)
        snowflakeTagName: "i", // [string] Tag name of snowflakes (default: "i") (e.g. "i", "span", "div") (shorter tags are recommended)
        snowflakeClassName:"s" // [string] Class name of snowflakes (default: "s") (e.g. "s", "snowflake", "snow") (shorter class names are recommended)
    };

    let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)"); // check if user prefers reduced motion

    let snowflakes = [];

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
        if(config.enable) {
            if(prefersReducedMotion.matches) { // if user prefers reduced motion
                console.log("User prefers reduced motion - snow.js was disabled.");
                config.enable = false;
                return;
            }

            if(snowflakes == 0) { // if not already initialized
                for (var i = 0; i < config.maxSnow; i++) {
                    // create and index snowflakes
                    snowflakes[i] = addElement(config.snowflakeTagName, config.snowContainer, config.snowflakeClassName);
                }

                for (var i = 0; i < config.maxSnow; i++) {
                    snowflakes[i].top = 0 + config.offsetTop + -snowRound(snowRandom(config.initialYSpacing));
                }

                // snow tick //
                window.setInterval(function () {
                    tickSnow();
                }, config.tickTime);
            }

            for (var i = 0; i < config.maxSnow; i++) {
                snowflakes[i].left = snowRound((window.innerWidth / config.maxSnow) * i); // set initial position left
            }
        } else {
            // snow is disabled by config
        }
    }

    function tickSnow() {
        if(!config.enable) {
            return; // Don't calculate snow - either disabled by config or user prefers reduced motion
        }

        for (which of snowflakes) {
            // TP if out of bounds
            tpSnowFlake(which);

            // Do gravity
            which.top += snowRound(snowRandom(config.gravityAmount));
            which.style.top = which.top + "px";
    
            // Do jitter
            which.left += snowRound(snowRandom(config.jitterAmount)) - (config.jitterAmount / 2);
            which.style.left = which.left + "px";
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

        which.top = config.top;

        return which;
    }


    function snowRandom(max,roundType) {
        if(!roundType) {
            return(Math.random() * max);
        } else if(roundType == 1 || roundType == "floor") {
            return(Math.floor(Math.random() * max));
        }
    }


    function snowRound(which) {
        return(+which.toFixed(config.maxDecimalLength));
    }


    // function tpSnowFlake
    // Teleports snowflakes to the other end of the screen if they are out of bounds
    // we do this like this to have a more efficient tick function - the gravity won't ever change
    if(config.gravityAmount < 0) { // if gravity is negative
        function tpSnowFlake(which) {
            if (which.top < 0 + config.offsetTop) {
                which.top = window.innerHeight + config.offsetBottom;
            }
        }
    } else { // if gravity is positive
        function tpSnowFlake(which) {
            if(which.top > window.innerHeight + config.offsetBottom) {
                which.top = 0 + config.offsetTop;
            }
        }
    }



    // add event listeners

    addEventListener("load",function() {
        initSnow();
    });

    addEventListener("resize",function() {
        initSnow();
    });

    prefersReducedMotion.addEventListener("change",function() {
        // things happen if user changes preference
        if(prefersReducedMotion.matches) {
            config.enable = false;
        } else {
            config.enable = true;
        }
        initSnow();
    });
})();
