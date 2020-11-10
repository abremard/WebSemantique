
function fillInfo(JSONresponse) {
    var game = JSONresponse.results.bindings[0];
    if (game.name.value !== null && game.name.value !== undefined) {
        var gameTitle = game.name.value; // = game.jv.value;
        document.getElementById("game-title").innerHTML = gameTitle;
    }
    if (game.computingPlatformName.value !== null && game.computingPlatformName.value !== undefined) {
        // tell Stefan to add platform to html
        var gamePlatform = game.computingPlatformName.value;
        // document.getElementById("game-platform").innerHTML = " Genre: "+gamePlatform;
    }
    if (game.label.value !== null && game.label.value !== undefined) {
        var gameGenre = game.label.value;
        document.getElementById("game-genre").innerHTML = " Genre: "+gameGenre;
    }
    if (game.developerName.value !== null && game.developerName.value !== undefined) {
        var gameStudio = game.developerName.value;
        document.getElementById("game-studio").innerHTML = " Studio: "+gameStudio;
    }
    if (game.publisherName.value !== null && game.publisherName.value !== undefined) {
        var gamePublisher = game.publisherName.value;
        document.getElementById("game-publisher").innerHTML = " Publisher: "+gamePublisher;
    }
    if (game.composerName.value !== null && game.composerName.value !== undefined) {
        var gameComposer = game.composerName.value;
        document.getElementById("game-composer").innerHTML = " Composer: "+gameComposer;
    }
    if (game.desc.value !== null && game.desc.value !== undefined) {
        var gameDescription = game.desc.value;
        document.getElementById("game-description").innerHTML = ""+gameDescription;
    }
}

function buildQuery() {
    searchString = window.location.search.split("=")[1];
    sparqlQuery = "SELECT ?jv, ?name, ?computingPlatformName, ?seriesName, ?directorName, ?label, ?publisherName, ?developerName, ?composerName, str(?score), ?desc WHERE {?jv a dbo:VideoGame. OPTIONAL {?jv foaf:name ?name.} OPTIONAL {?jv dbo:abstract ?desc.} OPTIONAL {?jv dbo:genre ?genre.?genre rdfs:label ?label.} OPTIONAL {?jv dbo:composer ?composer.?composer foaf:name ?composerName.} OPTIONAL {?jv dbo:developer ?developer.?developer foaf:name ?developerName.} OPTIONAL {?jv dbo:publisher ?publisher.?publisher foaf:name ?publisherName.} OPTIONAL {?jv dbo:director ?director.?director foaf:name ?directorName.} OPTIONAL{?jv dbo:series ?series.?series rdfs:label ?seriesName.} OPTIONAL{?jv dbo:computingPlatform ?computingPlatform.?computingPlatform rdfs:label ?computingPlatformName.} OPTIONAL{?jv dbp:ign ?score.}FILTER (?jv = <"+searchString+"> && langMatches(lang(?desc),'EN') && langMatches(lang(?label),'EN') && langMatches(lang(?seriesName),'EN') && langMatches(lang(?computingPlatformName),'EN'))} LIMIT 1";
    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
    console.log(jsonResponse);
    fillInfo(jsonResponse);
}

function sendRequest(sparqlQuery) {
    var url = "http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+sparqlQuery+"&format=JSON";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    response = JSON.parse(xmlHttp.response);
    return response;
}


// $(document).ready(function($) {
//     buildQuery();
// });