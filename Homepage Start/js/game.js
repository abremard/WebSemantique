
function fillInfo(JSONresponse) {
    var game = JSONresponse;
        if (game.name !== null && game.name !== undefined) {
        var gameTitle = game.name.value; // = game.jv.value;
        document.getElementById("game-title").innerHTML = gameTitle;
    }
    if (game.computingPlatformName !== null && game.computingPlatformName[0] !== undefined) {
        var codeToPlace = "";
        var jsonData = game.computingPlatformName;
        for (var i = 0; i < jsonData.length - 1; i++) {
            var platform = jsonData[i];
            if (platform !== null && platform !== undefined ) {
                codeToPlace += platform.value + ", ";
            }
        }
        // last platform (no ',')
        var platform = jsonData[jsonData.length - 1];
        if (platform !== null && platform !== undefined ) {
            codeToPlace += platform.value;
        }

        document.getElementById("game-platform").innerHTML = codeToPlace;
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
    if (game.composerName !== null && game.composerName[0] !== undefined) {
        var gameComposer = game.composerName[0].value;
        document.getElementById("game-composer").innerHTML = " Composer: "+gameComposer;
    }
    if (game.desc !== null && game.desc !== undefined) {
        var gameDescription = game.desc.value;
        document.getElementById("game-description").innerHTML = ""+gameDescription;
    }
    if (game.score !== null && game.score !== undefined) {
        var gameScore = game.score.value;
        if (gameScore <= 10) {
            gameScore *= 10;
        }
        document.getElementById("game-score").className = "c100 p"+gameScore+" small green";
        document.getElementById("game-score-span").innerHTML = gameScore;
    }
    if (game.releaseDate !== null && game.releaseDate !== undefined) {
        var releaseDate = game.releaseDate.value;
        document.getElementById("game-release").innerHTML = releaseDate;
    }
    if (game.seriesName !== null && game.seriesName !== undefined)
    {
        //get and show the name of series
        var seriesName = game.seriesName.value;
        document.getElementById("series-name").innerHTML = "This game is a part of the "+seriesName+" series";
        
        //code that will be shown for the list of games
        var codeToPlace = "<table style=\"text-align: center;\"> <tr>";
        var codeImages = "";
        var codeNames = "";

        //get the list of uri for the associated games in the series
        var jsonData = game.jv2;
        //limit the number of games to show (can implement a scrolling list somehow?)

        var gameNames = {"games":[]};
        var gameInSeries;

        for (let i = 0; i < jsonData.length; i++) {
            gameInSeries = jsonData[i];
            if (gameInSeries !== null && gameInSeries !== undefined ) {
                //for each uri execute sparql query to find its name
                var response = buildQueryNameOnly(gameInSeries.value);
                if (response.results.bindings[0] !== null && response.results.bindings[0] !== undefined)
                {
                    gameNames.games.push(response.results.bindings[0].name.value);
                    var gameUri = gameInSeries.value;
                    gameUri = gameUri.split("'").join("%27");
                    imageId = "game-series-"+i;
                    codeNames += "<td width=\"150px\" onclick=\"window.location=\'./game.html?game="+gameUri+"\'\"><h4>"+response.results.bindings[0].name.value+"</h4></td>";
                    codeImages += "<td align=\"center\"><img id="+imageId+" src=\"images/placeholder.png\" width=\"150px\"></td>";
                }
            }
        }
        
        codeToPlace += codeImages + "</tr><tr>" + codeNames + "</tr></table>";
        document.getElementById("series-list").innerHTML = codeToPlace;

        getToken("https://id.twitch.tv/oauth2/token?client_id=fwjbd711sjss17utbfjasiuraxpjo6&client_secret=sb3u353foqmunyqh2t98y05ezjx905&grant_type=client_credentials", handleToken, JSON.stringify(jsonData), JSON.stringify(gameNames), game.name.value);

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
                awardList += "<td><h4 style=\"cursor: auto;\"><i class=\"material-icons\" style=\"font-size: 16px; color: #edc302;\">emoji_events</i> " + award.value + "</h4></td>"
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
    sparqlQuery = "SELECT ?jv, ?name, ?computingPlatformName, ?seriesName, ?directorName, ?label, ?publisherName,"
    + "?developerName, ?composerName, ?score, ?jv2, ?desc, ?releaseDate, ?awardName "
    + "WHERE { ?jv a dbo:VideoGame. OPTIONAL {?jv rdfs:label ?name.} OPTIONAL {?jv dbo:abstract ?desc.}"
    + "OPTIONAL {?jv dbo:genre ?genre. ?genre rdfs:label ?label.} OPTIONAL {?jv dbp:composer ?composer. ?composer foaf:name ?composerName.}"
    + "OPTIONAL {?jv dbo:developer ?developer. ?developer foaf:name ?developerName.}"
    + "OPTIONAL {?jv dbo:publisher ?publisher. ?publisher foaf:name ?publisherName.}"
    + "OPTIONAL {?jv dbo:director ?director. ?director foaf:name ?directorName.}"
    + "OPTIONAL{?jv dbo:series ?series. ?series rdfs:label ?seriesName.}"
    + "OPTIONAL{?jv dbo:computingPlatform ?computingPlatform. ?computingPlatform rdfs:label ?computingPlatformName.}"
    + "OPTIONAL{?jv dbp:ign ?score.} OPTIONAL{?jv dbo:releaseDate ?releaseDate.}  OPTIONAL{?jv dbp:award ?awardName.}"
    + "OPTIONAL{?jv dbo:series ?series. ?jv2 dbo:series ?series.} FILTER (?jv = <"+searchString+"> && langMatches(lang(?desc),'EN')"
    + "&& langMatches(lang(?label),'EN') && langMatches(lang(?seriesName),'EN') && langMatches(lang(?computingPlatformName),'EN')"
    + "&& langMatches(lang(?name),'EN'))}"
    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
    jsonResponse = removeDuplicates(jsonResponse);
    fillInfo(jsonResponse);
}

function buildQueryNameOnly(uri) {
    searchString = uri;
    sparqlQuery = "SELECT ?jv, ?name WHERE { ?jv a dbo:VideoGame. OPTIONAL {?jv rdfs:label ?name.} FILTER (?jv = <"+searchString+"> && langMatches(lang(?name),'EN'))}"
    sparqlQuery = encodeURIComponent(sparqlQuery);
    jsonResponse = sendRequest(sparqlQuery);
    return jsonResponse;
}

function sendRequest(sparqlQuery) {
    var url = "http://dbpedia.org/sparql/?default-graph-uri=http%3A%2F%2Fdbpedia.org&query="+sparqlQuery+"&format=JSON";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    response = JSON.parse(xmlHttp.response);
    return response;
}

function searchButton() {
    let searchString = document.getElementById("search").value;
    window.location.href = "./Results.html?search="+searchString;
}

function xhrSuccess() { 
    this.callback.apply(this); 
}

function getToken(url, callback, jsonData, gameNames, game) {
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.open("POST", url, true);
    xhr.send(null);
}

function handleToken() {
    var response = JSON.parse(this.responseText);
    var token = response.access_token;
    var auth = "Bearer "+token;
    var jsonData = JSON.parse(this.arguments[0]);
    var gameNames = JSON.parse(this.arguments[1]).games;

    // the main game
    var game = this.arguments[2];
    getGameId("https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games", handleGameId, auth, game, "game-image");

    // each games of the series
    for (let j = 0; j < jsonData.length; j++) {
        gameInSeries = jsonData[j];
        if (gameInSeries !== null && gameInSeries !== undefined ) {
            var name = gameNames[j];
            var HtmlId = "game-series-"+j;
            getGameId("https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games", handleGameId, auth, name, HtmlId);
        }
    }

}

function getGameId(url, callback, auth, name, HtmlId) {
    payload = 'search "'+name+'"; limit 1; fields *;';
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Client-ID', "fwjbd711sjss17utbfjasiuraxpjo6");
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    xhr.setRequestHeader('Authorization', auth);
    xhr.send(payload);
}

function handleGameId() {
    var response = JSON.parse(this.responseText);
    var auth = this.arguments[0];
    var HtmlId = this.arguments[2];
    var gameId = response[0].id;
    getCover("https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/covers", handleCover, auth, gameId, HtmlId, 0);
}

function getCover(url, callback, auth, gameId, HtmlId, retries) {
    payload = 'fields url, width, height; where game = '+gameId+';';
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Client-ID', "fwjbd711sjss17utbfjasiuraxpjo6");
    xhr.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    xhr.setRequestHeader('Access-Control-Allow-Origin', "*");
    xhr.setRequestHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    xhr.setRequestHeader('Authorization', auth);
    xhr.send(payload);
}

function handleCover() {
    if (this.status !== 200 && this.arguments[3] < 5) {
        this.arguments[3] = this.arguments[3] + 1;
        getCover("https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/covers", handleCover, this.arguments[0], this.arguments[1], this.arguments[2], this.arguments[3]);
    }
    var response = JSON.parse(this.responseText);
    var HtmlId = this.arguments[2];
    var uri = response[0].url;
    uri = uri.replace('t_thumb', 't_cover_big');
    document.getElementById(HtmlId).setAttribute('src', "https:"+uri);
}


$(document).ready(function($) {

    $("#searchForm").submit(function() {
        searchButton();
        return false;
    });

    buildQuery();

});