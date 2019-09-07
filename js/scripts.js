// Variablen

var baseURL = "http://localhost:4000";


async function searchWithData(formData) {
     let message = buildFormMessage(formData);

     let resJSON = await fetchJSON(message);
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
        "plz": data.plz.value,
        "plzPerimeter": data.plzPerimeter.value,
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