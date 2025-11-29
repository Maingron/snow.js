// snow.js 2.1.0 by Maingron (https://maingron.com/snowjs)
// Licensed under MIT (https://github.com/Maingron/snow.js/blob/master/LICENSE)

// Snow.js is a standalone JavaScript library for creating snow effects on web pages.
// It is designed to be lightweight and easy to use.


(function() {
	// CONFIGURATION //
	let config = {
		// Basic settings
		enable: true, // [boolean] Enable snow (default: true)
		preset : "none", // [string] Preset (default: "none")
		snowChars: ["*"], // [array] Characters to use for snowflakes (default:["*"]) (e.g. ["*", "❅", "❆"])
		snowOpacity: 0.75, // [number 0-1] Opacity of snowflakes (default:0.75) (0 = transparent, 1 = opaque)
		tickTime: (1000/60), // [number] Time between each tick in milliseconds (default: 1000/60) (higher = slower) (1000/60 = 60fps; 1000/30 = 30fps)
		maxSnow: window.innerHeight / 8, // [number] Maximum number of snowflakes to render at once (default: window.innerHeight / 8)
		jitterAmount: 2, // [number] Amount of jitter to apply to snowflakes each tick (default: 2)
		jitterProbability: .8, // [number 0-1] Probability of jitter being applied to each snowflake each tick (default: 0.8) (0 = never, 1 = always)
		windAmount: .5, // [number] Amount of wind to apply to snowflakes each tick (default: 0.5) (positive = right, negative = left)
		gravityAmount: 3, // [number] Amount of gravity to apply to snowflakes each tick (default: 3)
		gravityJitterAmount: 4, // [number] Amount of gravity jitter to apply to snowflakes each tick (default: 4)
		gravityJitterProbability: .5, // [number 0-1] Probability of gravity jitter being applied to each snowflake each tick (default: 0.5) (0 = never, 1 = always)
		overscanX: 100, // [number] Overscan in px for X axis (default: 100) (makes snowflakes spawn offscreen on the sides)
		initialYSpacing: -window.innerHeight - 200, // [number] Initial Y spacing in px for snowflakes (default: -window.innerHeight - 200) "-window.innerHeight" makes the snowflakes spawn across the entire screen
		offsetTop: -100, // [number] Offset top in px for snowflakes (default: -100)
		offsetBottom: 100, // [number] Offset bottom in px for snowflakes (default: 100)
		snowSizes: ["20px","25px","35px","40px"], // [array] Sizes of snowflakes (default: ["20px","25px","35px","40px"])
		snowColors: ["#ccc","#fff","#edf"], // [array] Colors of snowflakes (default: ["#ccc","#fff","#edf"])
		snowFont: "inherit", // [string] (CSS) Font of snowflakes (default: "inherit") (e.g. "Arial", "Times New Roman", sans-serif)
	
		// Advanced and experimental settings
		snowContainer: document.body, // [object] Container to render snowflakes in (default: document.body)
		cssTransition: 0, // [number] CSS transition time in seconds (default: 0) (0 = no transition)
		autoFixScriptTag: false, // [boolean] Automatically fix some script tag attributes (default: false) 
		maxDecimalLength: 1, // [number] Maximum decimal length for snowflake positions (default: 1) (higher = more accurate but slower) (0.123456789)
		snowflakeTagName: "i", // [string] Tag name of snowflakes (default: "i") (e.g. "i", "span", "div") (shorter tags are recommended)
		snowflakeClassName:"s" // [string] Class name of snowflakes (default: "s") (e.g. "s", "snowflake", "snow") (shorter class names are recommended)
	};

	// PRESETS //
	let presets = {
		"none": {},
		"halloween": {
			snowChars: ["🎃", "👻", "🎃", "👻", "🦇", "🧟", "🧛"],
			// snowChars: ["🎃", "👻", "🎃", "👻", "🦇", "🕷", "🕸", "🧟", "🧛"],
			gravityAmount: -.5,
			jitterAmount: 6,
			snowOpacity: .15,
			maxSnow: 80,
			snowSizes: ["50px", "60px", "70px", "80px"]
		},
		"christmas": {
			snowChars: ["❅", "❆", "❄","🎄", "🎅", "🎁", "🦌"],
			snowOpacity: 0.75,
			jitterAmount: 2,
			gravityAmount: 3,
			snowSizes: ["20px","25px","35px","40px"],
			snowColors: ["#ccc","#fff","#edf"],
			maxSnow: window.innerHeight / 16
		},
		"newyear": {
			snowChars: ["*","*","*","*",new Date().getFullYear()],
			snowOpacity: 0.75,
			jitterAmount: .5,
			gravityAmount: -30,
			maxSnow: 30,
			snowColors: ["purple","red","green","blue","yellow"],
		},
		"winter": {
			snowChars: ["❅", "❆", "❄", "☃", "⛄"],
			snowOpacity: 0.75,
			jitterAmount: 2,
			gravityAmount: 3,
			snowColors: ["#ccc","#fff","#edf"]
		}
	};

	let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)"); // check if user prefers reduced motion

	let snowflakes = [];

	if(config.preset !== "none") {
		config = Object.assign(config, presets[config.preset]);
	}

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


	function initSnow(repositionOnly = false) {
		if(config.enable) {
			if(prefersReducedMotion.matches) { // if user prefers reduced motion
				console.log("User prefers reduced motion - snow.js was disabled.");
				config.enable = false;
				return;
			}

			if(repositionOnly && snowflakes) {
				window.setTimeout(function() {
					for (let i = 0; i < config.maxSnow; i++) {
						snowflakes[i].left = 0 - config.overscanX + snowRound(((window.innerWidth + config.overscanX) / config.maxSnow) * i);
					}
				}, 0);

				return;
			}

			if(snowflakes == 0) { // if not already initialized
				for (var i = 0; i < config.maxSnow; i++) {
					// create and index snowflakes
					snowflakes[i] = addElement(config.snowflakeTagName, config.snowContainer, config.snowflakeClassName);
					snowflakes[i].top = 0 + config.offsetTop + -snowRound(snowRandom(config.initialYSpacing));
					snowflakes[i].left = 0 - config.overscanX + snowRound(((window.innerWidth + config.overscanX) / config.maxSnow) * i); // set initial position left
				}

				// snow tick //
				window.setInterval(function () {
					tickSnow();
				}, config.tickTime);
			}

		}
	}

	function tickSnow() {
		if(!config.enable) {
			return; // Don't calculate snow - either disabled by config or user prefers reduced motion
		}

		for (which of snowflakes) {
			// TP if out of bounds
			tpSnowFlake(which);

			// Do gravity´
			if(Math.random() < config.gravityJitterProbability) {
				which.top += snowRound(config.gravityAmount + snowRandom(config.gravityJitterAmount));
			} else {
				which.top += snowRound(config.gravityAmount);
			}

			// Do wind
			which.left += snowRound(config.windAmount);
	
			// Do jitter
			if(Math.random() < config.jitterProbability) {
				which.left += snowRound(snowRandom(config.jitterAmount)) - (config.jitterAmount / 2);
			}

			which.style.top = which.top + "px";
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


	// Teleports snowflakes to the other end of the screen if they are out of bounds
	function tpSnowFlake(which) {
		if(config.gravityAmount < 0) { // if gravity is negative
			if (which.top < 0 + config.offsetTop) {
				which.top = window.innerHeight + config.offsetBottom;
			}
		} else {
			if(which.top > window.innerHeight + config.offsetBottom) {
				which.top = 0 + config.offsetTop;
			}
		}

		if(which.left < 0 - config.overscanX) {
			which.left += window.innerWidth + config.overscanX;
		} else if(which.left > window.innerWidth + config.overscanX) {
			which.left -= (window.innerWidth + config.overscanX + config.overscanX);
		}
	}

	// add event listeners

	addEventListener("load",function() {
		initSnow(false);
	});

	addEventListener("resize",function() {
		initSnow(true);
	});

	prefersReducedMotion.addEventListener("change",function() {
		// things happen if user changes preference
		if(prefersReducedMotion.matches) {
			config.enable = false;
		} else {
			config.enable = true;
		}
		initSnow(true);
	});
})();
