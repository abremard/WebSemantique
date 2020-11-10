function searchButton() {
    searchString = document.getElementById("search").value;
    window.location.href = "./Results.html?search="+searchString;
    sparqlQuery = buildQuery();
}


function buildQuery() {
    searchString = window.location.search.split("=")[1];
    sparqlQuery = "SELECT * WHERE {?jv a dbo:VideoGame; foaf:name ?name. FILTER ( regex(?jv, '"+searchString+".*', 'i') )} LIMIT 100";
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
        var name = elem.name.value;
        var uri = elem.jv.value;
        tmpHtml += "<tr><td><h2>"+name+"</h2><p>2016</p><p>This is a game description.</p></td></tr>";
    });
    document.getElementById("resultTable").innerHTML = tmpHtml;
}

function retrieveDetails() {
    console.log("test");
    // todo redirect to game.html with the correct uri as parameter
}

function chooseWallpaper() {
    var elem = document.getElementById("background");
    var num = Math.floor((Math.random()*3) + 1);
    var photo = "url(./images/" + num + ".png)";
    elem.style.background = photo;
}

$(document).ready(function($) {
    $("tr").click(function() {
        retrieveDetails();
    });


    $("#search").keyup(function(ev) {
        // 13 = ENTER
        if (ev.which === 13) {
            console.log("enter on input field");
            searchButton();
        }
    });

});