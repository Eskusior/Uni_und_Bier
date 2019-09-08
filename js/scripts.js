// Variablen

var baseURL = "http://localhost:4000"; // URL für Backend
//var baseURL = "http://webengineering.ins.hs-anhalt.de:32197";

var mymap = L.map('mapid').setView([51.54194444444445, 9.934444444444445], 13);

// MapLayer von OSM
var mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    'attribution':  'Kartendaten &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende',
    'useCache': true
}).addTo(mymap);

var resultWrapper = document.getElementById("resultWrapper"); // Ankerpunkt für Ergebnisanzeige

// Anhand Formdaten die Suche in Stardog durchführen
async function searchWithData(formData) {
     let message = buildFormMessage(formData);

     let resJSON = await fetchJSON(message);

     console.log(resJSON);
}

// Funktion zum Holen der Daten und Umwandeln in JSON
async function fetchJSON(body) {
    let url = baseURL + '/universities';

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    return await response.json();
}

// Baut aus den eingegebenen Daten die JSON für das Backend zusammen
function buildFormMessage(data){
    let message = {
        "uniName" : data.universityname.value,
        "subject": data.subject.value,
        "extraOptions": [
            {
                "count": data.optionCount1.value,
                "type": data.optionType1.value,
                "perimeter": data.perimeterValue1.value
            },{
                "count": data.optionCount2.value,
                "type": data.optionType2.value,
                "perimeter": data.perimeterValue2.value
            },{
                "count": data.optionCount3.value,
                "type": data.optionType3.value,
                "perimeter": data.perimeterValue3.value
            }
        ]
    }

    return message;
}

// Neues Result Element hinzufügen
function createNewResult(data) {
    // Wichtige Daten aus data holen
    let name = "";
    let url = "";

    // Kartendaten setzen


    // Aufteilung für Übersichtlichkeit
    let resultHTML1 = "<div class='result' id='result1'><button class='accordion'>Result 1</button>";
    let resultHTML2 = "<div class='panel'><div class='resultWrapper'><div class='resultInfo'>";
    let resultHTML3 = "<span class='resultText'>Hochschule ABC</span><br />";
    let resultHTML4 = "<span class='resultText'><a href='#'>Link zur Website</a></span></div>";
    let resultHTML5 = "<div class='map resultMap' id='mapid'></div></div></div></div>";

    // TMP Element als Anker für HTML String
    let tmp = document.createElement("div");

    tmp.innerHTML = resultHTML;

    // An resultWrapper anbringen
    resultWrapper.append(tmp);
}