function buildQuery() {
    searchString = decodeURIComponent(window.location.search.split("=")[1]);
    // sparqlQuery = 'SELECT * WHERE {?jv a dbo:VideoGame. ?jv foaf:name ?name. FILTER ( regex(?name, "'+searchString+'.*", "i") )}';
    sparqlQuery = 'SELECT ?jv ?name (MIN(?date) AS ?releaseDate) ?desc WHERE { '
        + '?jv a dbo:VideoGame. ?jv foaf:name ?name. ?jv dbo:releaseDate ?date. ?jv dbo:abstract ?desc.'
        + ' FILTER ( regex(?name, "' + searchString + '.*", "i") && langMatches(lang(?desc),\'EN\')) }'
        + 'GROUP BY ?jv ?name ?desc';

    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
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

        var year = elem.releaseDate.value;
        tmpHtml += "<p><i>"+year+"</i></p>";

        var description = "";
        if (elem.desc.value.length > descSizeLimit){
            description = elem.desc.value.slice(0, descSizeLimit) + "...";
        } else {
            description = elem.desc.value;
        }
        tmpHtml += "<p>" + description + "</p></td></tr>";
    });
    document.getElementById("resultTable").innerHTML = tmpHtml;
}

$(document).ready(function($) {

    console.log("ready");
    buildQuery();

});