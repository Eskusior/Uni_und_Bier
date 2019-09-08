// Variablen

var baseURL = "http://localhost:4000"; // URL für Backend
//var baseURL = "http://webengineering.ins.hs-anhalt.de:32197";

var counter = 0;

var results = document.getElementById("results"); // Ankerpunkt für Ergebnisanzeige
var noResults = document.getElementById("noResults");

// Anhand Formdaten die Suche in Stardog durchführen
async function searchWithData(formData) {

    results.innerHTML = "";
    
    counter = 0;
     let message = buildFormMessage(formData);

     let resJSON = await fetchJSON(message);

     if(resJSON.results) {
         noResults.style.display = "none";
         for(var i = 0; i < resJSON.results.bindings.length; i++) {
            createNewResult(resJSON.results.bindings[i]);
            counter++;
        }
        initAccordions();
     }
     else {
        noResults.style.display = "block";
     }
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
    let name = data.uniName.value;
    let url = data.uniURL.value;

    let lat = data.uniLat.value;
    let lon = data.uniLon.value;

    let resultID = "result" + counter;
    let mapID = "map" + counter;

    // Aufteilung für Übersichtlichkeit
    let resultHTML1 = "<div class='result' id='" + resultID +"'><button class='accordion'>" + name + "</button>";
    let resultHTML2 = "<div class='panel'><div class='resultWrapper'><div class='resultInfo'>";
    let resultHTML3 = "<span class='resultText'>" + name +"</span><br />";
    let resultHTML4 = "<span class='resultText'><a href='" + url + "'>Link zur Homepage</a></span></div>";
    let resultHTML5 = "<div class='map resultMap' id='" + mapID +"'></div></div></div></div>";

    // TMP Element als Anker für HTML String
    let tmp = document.createElement("div");

    resultHTML = resultHTML1.concat(resultHTML2, resultHTML3, resultHTML4, resultHTML5);

    tmp.innerHTML = resultHTML;

    // An resultWrapper anbringen
    results.append(tmp);

    // Kartendaten setzen
    var map = L.map(mapID).setView([lat, lon], 15);

    var uniMarker = L.marker([lat, lon]).addTo(map);

    // MapLayer von OSM
    var mapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        'attribution':  'Kartendaten &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Mitwirkende',
        'useCache': true
    }).addTo(map);

}