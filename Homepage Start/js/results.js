function buildQuery() {
    searchString = decodeURIComponent(window.location.search.split("=")[1]);
    sparqlQuery = 'SELECT * WHERE {?jv a dbo:VideoGame. ?jv foaf:name ?name. FILTER ( regex(?name, "'+searchString+'.*", "i") )}';
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
        // if (elem.name.value !== "") {
        //     var name = elem.name.value;
        //     tmpHtml += "<h2>"+name+"</h2>";            
        // }
        // if (elem.name.value !== "") {
        //     var name = elem.name.value;
        //     tmpHtml += "<h2>"+name+"</h2>";            
        // }
        // var uri = elem.jv.value;
        var year = "2016";
        tmpHtml += "<p>"+year+"</p>";
        tmpHtml += "<p>This is a game description.</p></td></tr>";
    });
    document.getElementById("resultTable").innerHTML = tmpHtml;
}

$(document).ready(function($) {

    console.log("ready");
    buildQuery();

});