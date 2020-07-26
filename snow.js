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
    "snowContainer": document.body,
    "snowChar": "*",
    "tickTime": 25, //ms
    "maxSnow": window.innerHeight / 8,
    "jitterAmount": 3,
    "gravityAmount": 3,
    "initialYDistance": window.innerHeight + 80,
    "cssTransition": 0, //seconds; not recommended
    "snowSizes": ["15px", "20px", "25px","30px","35px","40px","45px"],
    "snowColors": ["#fff","#fff","#fff","#fff","#fff","#fff","#99f","#f99","#edf","#afa"],
    "snowFont": "Calibri, Jokerman, Arial, Tahoma, sans-serif"
}



function addElement(which, where, nclass, nid) {
    which1 = document.createElement(which);
    where = document.body;
    if (nclass) {
        if (nclass == "asnow") {
            which1.innerHTML = snow.config.snowChar;
            which1.style.top = 0;
            which1.style.color = snow.config.snowColors[Math.floor((Math.random() * snow.config.snowColors.length))];
            which1.style.fontSize = snow.config.snowSizes[Math.floor((Math.random() * snow.config.snowSizes.length))];
        }
        which1.classList.add(nclass);

    }
    if (nid) {
        which1.classList.add(nid);
    }
    where.appendChild(which1);
}



addElement("style", document.body, "snowstyle");
document.getElementsByClassName("snowstyle")[0].innerHTML = `
.asnow {
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


for (var i = 0; i < snow.config.maxSnow; i++) {
    addElement("i", snow["data"]["parent"], "asnow");
}
snow.elements.snowflakes = document.getElementsByClassName("asnow");

for (var i = 0; i < snow.config.maxSnow; i++) {
    snow.elements.snowflakes[i].left = (window.innerWidth / snow.config.maxSnow) * i; // set initial position left
    snow.elements.snowflakes[i].top = -(Math.random() * snow.config.initialYDistance);
}


window.setInterval(function () {

    for (var i = 0; i < snow.elements.snowflakes.length; i++) {
        var j = snow.elements.snowflakes[i];

        if (j.top < window.innerHeight) {
            j.top = j.top + (Math.random() * snow.config.gravityAmount);
            j.style.top = j.top + "px";
        } else {
            j.top = -60;
        }

        j.left = j.left + ((Math.random() * snow.config.jitterAmount) - (snow.config.jitterAmount / 2)); // add jittering
        j.style.left = j.left + "px";
    }
}, snow.config.tickTime);