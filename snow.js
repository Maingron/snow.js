var snow = [];
snow["data"] = [];
snow["temp"] = snow["t"] = [];
snow["objects"] = [];

snow["data"]["parent"] = document.body;
snow["data"]["snowchar"] = "*";
snow["data"]["ticktime"] = 25 //ms
snow["data"]["max_snow"] = window.innerHeight / 8;
snow["data"]["jitter_amount"] = 3;
snow["data"]["gravity_amount"] = 3;
snow["data"]["initial_y_distance"] = window.innerHeight + 80;
snow["data"]["css_transition"] = 0 //seconds; not recommended
snow["data"]["snow_size"] = ["15px", "20px", "25px","30px","35px","40px","45px"];
snow["data"]["snow_color"] = ["#fff","#fff","#fff","#fff","#fff","#fff","#99f","#f99","#edf","#afa"];
snow["data"]["font_family"] = "Calibri, Jokerman, Arial, Tahoma, sans-serif";
/**/





function addElement(which, where, nclass, nid) {
    which1 = document.createElement(which);
    where = document.body;
    if (nclass) {
        if (nclass == "asnow") {
            which1.innerHTML = snow["data"]["snowchar"];
            which1.style.top = 0;
            which1.style.color = snow["data"]["snow_color"][Math.floor((Math.random() * snow["data"]["snow_color"].length))];
            which1.style.fontSize = snow["data"]["snow_size"][Math.floor((Math.random() * snow["data"]["snow_size"].length))];
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
    font-family: `+snow["data"]["font_family"]+`;
    transition :`+snow["data"]["css_transition"]+`s;
    font-style: normal;
    pointer-events: none;
}
`;


for (snow["temp"]["snowc"] = 0; snow["temp"]["snowc"] < snow["data"]["max_snow"]; snow["temp"]["snowc"]++) {
    addElement("i", snow["data"]["parent"], "asnow");
}
snow["objects"]["snowflakes"] = document.getElementsByClassName("asnow");

for (snow["t"]["isnowpos"] = 0; snow["t"]["isnowpos"] < snow["data"]["max_snow"]; snow["t"]["isnowpos"]++) {
    snow["objects"]["snowflakes"][snow["t"]["isnowpos"]].left = (window.innerWidth / snow["data"]["max_snow"]) * snow["t"]["isnowpos"]; // set initial position left
    snow["objects"]["snowflakes"][snow["t"]["isnowpos"]].top = -(Math.random() * snow["data"]["initial_y_distance"]);

}




window.setInterval(function () {

    for (snow["t"]["snowtickc"] = 0; snow["t"]["snowtickc"] < snow["objects"]["snowflakes"].length; snow["t"]["snowtickc"]++) {
        snow["t"]["cticksnow"] = snow["objects"]["snowflakes"][snow["t"]["snowtickc"]];

        if (snow["t"]["cticksnow"].top < window.innerHeight) {
            snow["t"]["cticksnow"].top = snow["t"]["cticksnow"].top + (Math.random() * snow["data"]["gravity_amount"]);
            snow["t"]["cticksnow"].style.top = snow["t"]["cticksnow"].top + "px";
        } else {
            snow["t"]["cticksnow"].top = -60;
        }

        
        snow["t"]["cticksnow"].left = snow["t"]["cticksnow"].left + ((Math.random() * snow["data"]["jitter_amount"]) - (snow["data"]["jitter_amount"] / 2)); // add jittering
        snow["t"]["cticksnow"].style.left = snow["t"]["cticksnow"].left + "px";


    }
}, snow["data"]["ticktime"]);