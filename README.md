# Uni und Bier
"Uni und Bier" ist eine Webanwendung zur Suche nach Universitäten in Deutschland mit weichen Kriterien zu suchen.

## Einleitung
Die Webanwendung "Uni und Bier" bietet Nutzern die Möglichkeit nach Universitäten in Deutschland zu suchen. Hierbei wird dem Nutzer, abseits von der Suche nach Universitätsname und Studiengang, die Möglichkeit gegeben zusätzlich nach weicheren Kriterien zu suchen. So sind Anfragen der Art "Universitäten mit 3 Restaurants im Umkreis von 3km" möglich.

## Komponentenübersicht

#### Frontend
Das Frontend ist eine einfache Webapp, welche ohne Framework entwickelt wurde.


#### nginx
Als Webserver wird ein nginx verwendet. Die zugehörige Konfiguration befindet sich im Ordner [NGINX/](./NGINX). Die Webandwendung wird über den Port 80 zur Verfügung gestellt. Die [docker-compose.yaml](.NGINX/docker-compose.yaml), welche sich im gleichen Ordner befindet wird zur lokalen Ausführung des nginx in einem Docker-Container genutzt.


#### Backend
Das Backend ist eine in Python geschriebene Anwendung und befindet sich unter [Backend/](./Backend). Zur Erstellung wurde das im Ordner befindliche [Jupyter Notebook](./Backend/Backend_Notebook.ipynb) genutzt und anschließend als [server.py](./Backend/server.py) exportiert. Das Backend ist zuständig für das Erstellen der SPARQL-Anfrage an den Triplestore und dem weiterleiten der Antwort an das Frontend. Das Dockerfile ist Ausgangspunkt für das Erstellen des benötigten Docker-Container. Innerhalb des Containers läuft das Backend auf Port 5002.

#### Datenextraktion
Die Daten der Unversitäten werden von der Seite ["timeshighereducation"](https://www.timeshighereducation.com/) ausgelesen. Hierfür befindet sich im Ordner [extraction/](./extraction) das [Jupyter Notebook](./extraction/Unidaten.ipynb). Das Notebook lädt die Daten von der genannten Seite und filtert diese nach den in Deutschland befindlichen Universitäten. Danach wird für jede Universität eine Anfrage an DBpedia gestellt, um weitere Daten, wie Geokoordinaten zu sammeln. Abschließend werden die gesammelten Daten in einer JSON-Datei abgespeichert.

#### Datenumwandlung
Für die Suche nach zum Beispiel Restaurants im Umkreis von Universitäten werden die Daten von [OpenStreetMaps](https://www.openstreetmap.de/) genutzt. Die entsprechenden Daten können über die Seite [Geofabrik](https://download.geofabrik.de/) als OSM-Daten heruntergeladen werden. Um die Daten nach bestimmten Lokalitäten, wie Restaurants oder Bahnhöfe, zu durchsuchen, wird das Programm [Osmosis](https://wiki.openstreetmap.org/wiki/Osmosis) genutzt. Das 
in Java geschriebene Programm durchsucht die OSM Daten nach bestimmten Tags, welche im OpenStreetMap-Wiki dokumentiert sind und filtert die entsprechenden Punkte in eine separate Datei. Zur Umwandlung der Dateien aus dem OSM-Format in das benötigte TTL-Format befindet sich im Ordner[OSM_to_TTL/](./OSM_to_TTL/) ein [Jupyter Notebook](./OSM_to_TTL/OSM_to_Turtle.ipynb), welches die Transformation durchführt. 

#### Stardog
Als Triplestore wird Stardog genutzt. Die extrahierten Daten werden im Stardog in einer Datenbank mit GEOSPARQL Erweiterung gepflegt. Dadurch können entsprechende SPARQL-Anfragen in Abhängigkeit von Geokoordinaten gestellt werden. Die Stardog-Lizens liegt im Ordner [Stardog/](./Stardog/) und wird über die [docker-compose.yaml](./docker-compose.yaml) in das entsprechende Verzeichnis im Docker-Container weitergeleitet. Die genutzten Daten befinden sich im selben Ordner und werden beim Erstellen des Docker-Containers mit geladen. 


## Konfiguration

Um die Docker-Container zu starten und darauf folgend Zugriff auf die entsprechenden Dienste zu haben müssen die entsprechenden Dateien angepasst werden.

#### Frontend
Im Frontend muss folgende URL angepasst werden:

*scripts.js*
```javascript
var baseURL = "[URL des Backends]";
```

#### Backend

Im Backend müssen folgende Daten angepasst werden:

```python
conn_details = {
    'endpoint': '[URL von Stardog]',
    'username': '[username]',
    'password': '[passwort]'
}

dbName = '[Datenbankname]'

```

#### docker-compose.yaml
In der *docker-compose.yaml* müssen abschließend noch die entsprechenden Ports gesetzt werden.

## Start

Um die Anwendung und die zugehörigen Abhängigkeiten zu starten genügt ein

```bash
docker-compose up -d

```

Die ensprechenden Docker-Container werden erstellt und die Anwendung ist unter der angegebenen URL verfügbar

## Anmerkung

Dieses Projekt ist im Zuge des Wahlpflichtmoduls "Linked Data and Semantic Web" im Studiengang "Angewandte Informatik" an der [Hochschule Anhalt](https://www.hs-anhalt.de/startseite.html) entstanden.

Entwickler:
Marti Mählck (marti.maehlck@student.hs-anhalt.de)
Johannes Bartsch(johannes.bartsch@student.hs-anhalt.de)