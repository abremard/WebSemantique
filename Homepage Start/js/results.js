function buildQuery() {
    searchString = window.location.search.split("=")[1];
    sparqlQuery = "SELECT * WHERE {?jv a dbo:VideoGame; foaf:name ?name; dbo:composer ?composer; dbp:gamezone ?gamezone. FILTER ( regex(?jv, '"+searchString+".*', 'i') )} LIMIT 100 ";
    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
    jsonParseGameList(jsonResponse);
    console.log(jsonResponse);
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
        var uri = elem.jv.value;
        tmpHtml += "<tr data-uri="+uri+"><td>";
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

function retrieveDetails(e) {

    console.log("click !");
    // var game = e.dataset.uri;
    // window.location.href = "../game.html?game="+game;
}


$(document).ready(function($) {

    console.log("ready");

    buildQuery();

    $("tr").click(function(e) {
        retrieveDetails(e);
    });

});