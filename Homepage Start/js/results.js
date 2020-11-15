function buildQuery() {
    searchString = decodeURIComponent(window.location.search.split("=")[1]);
    // sparqlQuery = 'SELECT * WHERE {?jv a dbo:VideoGame. ?jv foaf:name ?name. FILTER ( regex(?name, "'+searchString+'.*", "i") )}';
    sparqlQuery = 'SELECT ?jv ?name (MIN(?date) AS ?releaseDate) ?desc WHERE { '
        + '?jv a dbo:VideoGame. ?jv rdfs:label ?name. OPTIONAL{?jv dbo:releaseDate ?date.} OPTIONAL{?jv dbo:abstract ?desc.}'
        + ' FILTER ( regex(?name, "' + searchString + '.*", "i") && langMatches(lang(?desc),\'EN\') && langMatches(lang(?name),\'EN\')) }'
        + 'GROUP BY ?jv ?name ?desc';

    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
    jsonResponse.results.bindings = jsonResponse.results.bindings.sort(compareResults);
    jsonParseGameList(jsonResponse);
    return sparqlQuery;
}

function sendRequest(sparqlQuery) {
    var url = "http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+sparqlQuery+"&format=JSON";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    response = JSON.parse(xmlHttp.response);
    return response;
}

function getGame(uri) {
    var url = uri;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function jsonParseGameList(jsonObject) {

    const descSizeLimit = 140;

    // print number of games found
    document.getElementById("results-number").innerText = jsonObject.results.bindings.length;

    var tmpHtml = "";
    jsonObject.results.bindings.forEach(elem => {
        var name = elem.jv.value.split("/resource/")[1];
        var path = elem.jv.value.split("/resource/")[0];
        name = name.split("'").join("%27");
        var uri = path+"/resource/"+name;
        tmpHtml += '<tr onclick="window.location=\'./game.html?game='+uri+'\'"><td>';
        if (elem.name.value !== "") {
            var name = elem.name.value;
            tmpHtml += "<h2>"+name+"</h2>";            
        }

        var year = "";
        if (elem.releaseDate !== null && elem.releaseDate !== undefined) {
            year = elem.releaseDate.value;            
        }
        tmpHtml += "<p><i>"+year+"</i></p>";

        var description = "";
        if (elem.desc !== null && elem.desc !== undefined) {
            if (elem.desc.value.length > descSizeLimit){
                description = elem.desc.value.slice(0, descSizeLimit) + "...";
            } else {
                description = elem.desc.value;
            }            
        }
        tmpHtml += "<p>" + description + "...</p></td></tr>";
    });
    document.getElementById("resultTable").innerHTML = tmpHtml;
}

// returns 1 if object1 > object2, 0 if equal and -1 if object1 < object2
// convention : undefined < any
function compareResults(object1, object2) {
    if (object1.name !== undefined){
        if(object2.name !== undefined) {   // everything is defined
            if (object1.name.value > object2.name.value) {
                return 1;
            } else if (object1.name.value < object2.name.value) {
                return -1;
            } else {
                return 0;
            }
        } else {    // object2.name undefined
            return 1;
        }
    } else {
        return -1;
    }
}

// redundant with body onload
$(document).ready(function($) {

    // console.log("ready");
    buildQuery();

});