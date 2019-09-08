#!/usr/bin/env python
# coding: utf-8

# In[1]:


from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS
from sqlalchemy import create_engine
from json import dumps
from flask import jsonify, redirect
import optparse
import stardog

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}}) # CORS
api = Api(app)

conn_details = {
    'endpoint': 'http://webengineering.ins.hs-anhalt.de:32196',
    'username': 'admin',
    'password': 'admin'
}

dbName = 'db1'


# In[2]:


# Klasse um Daten aus Stardog zu holen
class getData(Resource):
    def post(self):
        if not request.json:
            return jsonify({'status': 'could not get requested data', 'statuscode': 409})
        else:
            query = buildQueryFromJSON(request.json)
            # Anfrage an Stardog
            with stardog.Connection(dbName, **conn_details) as conn:
                conn.begin()
                print(query)
                results = conn.select(query)
                print(results)
            return results

# Query aus Daten des Forms zusammenbauen
def buildQueryFromJSON(jsonData):
    i = 1 # Hochzähler für Optionen
    nameFilter = "FILTER contains(?uniName, '" + jsonData["uniName"] +"')." # Filter für Uninamen
    subjectFilter = "FILTER contains(?subjects, '" + jsonData["subject"] +"')." # Filter für Studiengang
    groupByString = "} GROUP BY ?uniName ?uniLat ?uniLon ?uniURL " # Ende WHERE und Group By
    havingString = "" # Leer, solange nicht klar, wieviele Zusatzoptionen ausgewählt sind
    
    # Prefixes
    queryPart1 = """prefix geo: <http://www.opengis.net/ont/geosparql#>
    prefix wgs: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    prefix geof: <http://www.opengis.net/def/function/geosparql/>
    prefix unit: <http://qudt.org/vocab/unit#>
    prefix star: <http://blog.stardog.com/geons/>
    prefix sch: <http://schema.org/>
    prefix httpsSch: <https://schema.org/>
    prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    prefix xsd: <http://www.w3.org/2001/XMLSchema#>
    """
    # Selectanweisung
    selectString = "SELECT DISTINCT ?uniName ?uniLat ?uniLon ?uniURL "
    
    # Where Anfang
    queryPart2 = """
    WHERE {
        ?uni sch:name ?uniName;
            httpsSch:hasOfferCatalog ?subjects;
            httpsSch:url ?uniURL;
            geo:hasGeometry ?uniGeo.
        ?uniGeo wgs:latitude ?uniLat;
                wgs:longitude ?uniLon.
                
    """
    
    # Für jede Zusatzoption
    for option in jsonData["extraOptions"]:
        # Variablen abspeichern
        name = "location" + str(i)
        count = option["count"]
        type = option["type"]
        perimeter = option["perimeter"]
        
        # Wenn alle Felder ausgefüllt
        if (name != '') and (count != 0) and (type != '') and (perimeter != ''):
        
            # Where für Option bauen
            locationString = """
            ?""" + name + """ rdf:type star:Location;
            rdf:type '"""+ type +"""';
            geo:hasGeometry ?geom.
            ?geom geof:nearby (?uniGeo """+ perimeter +""" unit:Kilometer).
            """
        
            # An Where anhängen
            queryPart2 += locationString
            # An Group By und Select anhängen
            groupByString += "?" + name + " "
            selectString += "?" + name + " "
        
            # Je nach Zahl an Having anhängen
            if(i == 1):
                havingString = "HAVING ((count(?"+ name +") >= " + count + ")"
            elif i == 2:
                havingString += " && (count(?"+ name +") >= " + count + ")"
            else:
                havingString += " && (count(?"+ name +") >= " + count + "))"
        else:
            # Wenn Option nicht vollständig ausgefüllt
            if(i == 3 and havingString != ""):
                havingString += ")"
        i += 1 # Counter hoch
    
    # Uniname nicht leer
    if jsonData["uniName"] != '':
        queryPart2 += nameFilter
    
    # Studiengang nicht leer
    if jsonData["subject"] != '':
        queryPart2 += subjectFilter
    
    # Having nicht leer, also min eine Zusatzoption gefüllt
    if(havingString != ""):
        queryPart2 += groupByString
        queryPart2 += havingString
    else:
        queryPart2 += "}" # ansonsten
    
    queryPart1 += selectString + queryPart2 # String zusammenfügen
    
    return queryPart1


# In[ ]:


# Klassen an entsprechende URLs binden
api.add_resource(getData, '/universities')

# Run für Testzwecke, startet auf localhost:5000
#if __name__ == "__main__":
 #   app.run(port=4000)

# Run für Dockercontainer, mit Portangabe
if __name__ == "__main__":
    parser = optparse.OptionParser(usage="python server.py -p ")
    parser.add_option('-p', '--port', action='store', dest='port', help='The port to listen on.')
    (args, _) = parser.parse_args()
    if args.port == None:
        print("Missing required argument: -p/--port")
        sys.exit(1)
    app.run(host='0.0.0.0', port=int(args.port), debug=False)
