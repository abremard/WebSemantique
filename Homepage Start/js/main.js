function searchButton() {
    search = document.getElementById("search").value;
    window.location.href = "./Results.html?search="+search;
    sparqlQuery = buildQuery(search);
}

function buildQuery() {
    search = window.location.search.split("=")[1];
    sparqlQuery = "SELECT * WHERE {?jv a dbo:VideoGame; foaf:name ?name. FILTER ( regex(?jv, 'Mario.*', 'i') )} LIMIT 100";
    sparqlQuery = encodeURIComponent(sparqlQuery);
    // jsonResponse = sendRequest(sparqlQuery).then((req, res) => {
    //     console.log("fin reponse");
    //     console.log(jsonResponse);
    //     jsonParseGameList(jsonResponse);
    // });
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
    jsonObject.results.bindings.forEach(elem => {
        var name = elem.name.value;
        var uri = elem.jv.value;
        document.getElementById("resultTable").innerHTML += "<tr class='clickable-row'><h2>"+name+"</h2><p>2016</p><p>This is a game description.</p></tr>";
    });
}

function retrieveDetails() {
    console.log("test");
}

function chooseWallpaper() {
    var elem = document.getElementById("background");
    var num = Math.floor((Math.random()*3) + 1);
    var photo = "url(./images/" + num + ".png)";
    elem.style.background = photo;
}

jQuery(document).ready(function($) {
    $(".clickable-row").click(function() {
        console.log("clicked");
    });
});