
function fillInfo(JSONresponse) {
    var game = JSONresponse;
    if (game.name !== null && game.name !== undefined) {
        var gameTitle = game.name.value; // = game.jv.value;
        document.getElementById("game-title").innerHTML = gameTitle;
    }
    if (game.computingPlatformName !== null && game.computingPlatformName !== undefined) {
        var gamePlatform = game.computingPlatformName.value;
        document.getElementById("game-platform").innerHTML = gamePlatform;
    }
    if (game.label !== null && game.label !== undefined) {
        var gameGenre = game.label.value;
        document.getElementById("game-genre").innerHTML = " Genre: "+gameGenre;
    }
    if (game.developerName !== null && game.developerName !== undefined) {
        var gameStudio = game.developerName.value;
        document.getElementById("game-studio").innerHTML = " Studio: "+gameStudio;
    }
    if (game.publisherName !== null && game.publisherName !== undefined) {
        var gamePublisher = game.publisherName.value;
        document.getElementById("game-publisher").innerHTML = " Publisher: "+gamePublisher;
    }
    if (game.composerName !== null && game.composerName !== undefined) {
        var gameComposer = game.composerName.value;
        document.getElementById("game-composer").innerHTML = " Composer: "+gameComposer;
    }
    if (game.desc !== null && game.desc !== undefined) {
        var gameDescription = game.desc.value;
        document.getElementById("game-description").innerHTML = ""+gameDescription;
    }
    if (game.score !== null && game.score !== undefined) {
        var gameScore = game.score.value;
        document.getElementById("game-score").className = "c100 p"+gameScore+" small green";
        document.getElementById("game-score-span").innerHTML = gameScore;
    }
    if (game.releaseDate !== null && game.releaseDate !== undefined) {
        var releaseDate = game.releaseDate.value;
        document.getElementById("game-release").innerHTML = releaseDate;
    }
    if (game.seriesName !== null && game.seriesName !== undefined)
    {
        var seriesName = game.seriesName.value;
        document.getElementById("series-name").innerHTML = "This game is a part of the "+seriesName+" series";
        //call sparql query to get names of video games 

    } else {
        document.getElementById("gameSeries").style.display = "none";
    }
    if (game.awardName !== null && game.awardName !== undefined)
    {
        
        var jsonData = game.awardName;
        var codeToPlace = "<h3>Awards and recognitions</h3><table><tr id=\"game-awards\">";
        var awardList = ""
        for (var i = 0; i < jsonData.length; i++) {
            var award = jsonData[i];
            if (award !== null && award !== undefined ) {
                awardList += "<td><h4><i class=\"material-icons\" style=\"font-size: 16px; color: #edc302;\">emoji_events</i> " + award.value + "</h4></td>"
            }
        }
        if (awardList!=="")
        {
            codeToPlace+=awardList;
            codeToPlace += "</tr></table><br/>"
            document.getElementById("award-panel").innerHTML = codeToPlace;
        } 
    }
}

function buildQuery() {
    searchString = decodeURIComponent(window.location.search.split("=")[1]);
    sparqlQuery = "SELECT ?jv, ?name, ?computingPlatformName, ?seriesName, ?directorName, ?label, ?publisherName, ?developerName, ?composerName, str(?score), ?jv2, ?desc, ?releaseDate, ?awardName WHERE { ?jv a dbo:VideoGame. OPTIONAL {?jv foaf:name ?name.} OPTIONAL {?jv dbo:abstract ?desc.} OPTIONAL {?jv dbo:genre ?genre. ?genre rdfs:label ?label.} OPTIONAL {?jv dbp:composer ?composer. ?composer foaf:name ?composerName.} OPTIONAL {?jv dbo:developer ?developer. ?developer foaf:name ?developerName.} OPTIONAL {?jv dbo:publisher ?publisher. ?publisher foaf:name ?publisherName.} OPTIONAL {?jv dbo:director ?director. ?director foaf:name ?directorName.} OPTIONAL{?jv dbo:series ?series. ?series rdfs:label ?seriesName.} OPTIONAL{?jv dbo:computingPlatform ?computingPlatform. ?computingPlatform rdfs:label ?computingPlatformName.} OPTIONAL{?jv dbp:ign ?score.} OPTIONAL{?jv dbo:releaseDate ?releaseDate.}  OPTIONAL{?jv dbp:award ?awardName.} OPTIONAL{?jv dbo:series ?series. ?jv2 dbo:series ?series.} FILTER (?jv = <"+searchString+"> && langMatches(lang(?desc),'EN') && langMatches(lang(?label),'EN') && langMatches(lang(?seriesName),'EN') && langMatches(lang(?computingPlatformName),'EN'))} LIMIT 1"
    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
    jsonResponse = removeDuplicates(jsonResponse);
    console.log(jsonResponse);
    fillInfo(jsonResponse);
}

function sendRequest(sparqlQuery) {
    var url = "http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+sparqlQuery+"&format=JSON";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    response = JSON.parse(xmlHttp.response);
    console.log(response);
    return response;
}


// $(document).ready(function($) {
//     buildQuery();
// });