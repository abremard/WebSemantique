
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

        var gameNames = [];
        var gameInSeries;

        for (let i = 0; i < jsonData.length; i++) {
            gameInSeries = jsonData[i];
            if (gameInSeries !== null && gameInSeries !== undefined ) {
                //for each uri execute sparql query to find its name
                var response = buildQueryNameOnly(gameInSeries.value);
                if (response.results.bindings[0] !== null && response.results.bindings[0] !== undefined)
                {
                    gameNames[i] = response.results.bindings[0].name.value;
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

        for (let j = 0; j < jsonData.length; j++) {
            gameInSeries = jsonData[j];
            if (gameInSeries !== null && gameInSeries !== undefined ) {
                var name = gameNames[j];
                var HtmlId = "game-series-"+j;
                var url = "https://id.twitch.tv/oauth2/token?client_id=fwjbd711sjss17utbfjasiuraxpjo6&client_secret=sb3u353foqmunyqh2t98y05ezjx905&grant_type=client_credentials";
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open( "POST", url, false );
                xmlHttp.send( null );
                var response = JSON.parse(xmlHttp.response);    
                var token = response.access_token;
                var auth = "Bearer "+token;
            
                payload = 'search "'+name+'"; limit 1; fields *;';
            
                // url = "	https://clyukqvj83.execute-api.us-west-2.amazonaws.com/production/v4/games";
                url = "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games";
                getGameId = new XMLHttpRequest();
                getGameId.open( "POST", url, false );
                getGameId.setRequestHeader('Client-ID', "fwjbd711sjss17utbfjasiuraxpjo6");
                getGameId.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
                getGameId.setRequestHeader('Access-Control-Allow-Origin', "*");
                getGameId.setRequestHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
                getGameId.setRequestHeader('Authorization', auth);
                getGameId.onload = function () {
                    gameIdResponse = JSON.parse(getGameId.response);
                    console.log(gameIdResponse);
                    payload = 'fields url, width, height; where game = '+gameIdResponse[0].id+';';
                        // url = "	https://clyukqvj83.execute-api.us-west-2.amazonaws.com/production/v4/covers";
                    url = "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/covers";
                    getCover = new XMLHttpRequest();
                    getCover.open( "POST", url, false );
                    getCover.setRequestHeader('Client-ID', "fwjbd711sjss17utbfjasiuraxpjo6");
                    getCover.setRequestHeader('Access-Control-Allow-Origin', "*");
                    getCover.setRequestHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
                    getCover.setRequestHeader('Authorization', auth);
                    getCover.onload = function() {
                        coverResponse = JSON.parse(getCover.response);
                        console.log(coverResponse);
                        var uri = coverResponse[0].url;
                        uri = uri.replace('t_thumb', 't_cover_big');
                        console.log(HtmlId);
                        document.getElementById(HtmlId).setAttribute('src', "https:"+uri);
                    };
                    getCover.send( payload );
                };
                getGameId.send( payload );
            }
        }

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

    var name = game.name.value;
    var HtmlId = 'game-image';
    var url = "https://id.twitch.tv/oauth2/token?client_id=fwjbd711sjss17utbfjasiuraxpjo6&client_secret=sb3u353foqmunyqh2t98y05ezjx905&grant_type=client_credentials";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", url, false );
    xmlHttp.send( null );
    var response = JSON.parse(xmlHttp.response);    
    var token = response.access_token;
    var auth = "Bearer "+token;

    payload = 'search "'+name+'"; limit 1; fields *;';

    // url = "	https://clyukqvj83.execute-api.us-west-2.amazonaws.com/production/v4/games";
    url = "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games";
    getGameId = new XMLHttpRequest();
    getGameId.open( "POST", url, true );
    getGameId.setRequestHeader('Client-ID', "fwjbd711sjss17utbfjasiuraxpjo6");
    getGameId.setRequestHeader("Access-Control-Allow-Headers", "Content-Type");
    getGameId.setRequestHeader('Access-Control-Allow-Origin', "*");
    getGameId.setRequestHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    getGameId.setRequestHeader('Authorization', auth);
    getGameId.onload = function () {
        gameIdResponse = JSON.parse(getGameId.response);
        console.log(gameIdResponse);
        payload = 'fields url, width, height; where game = '+gameIdResponse[0].id+';';
            // url = "	https://clyukqvj83.execute-api.us-west-2.amazonaws.com/production/v4/covers";
        url = "https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/covers";
        getCover = new XMLHttpRequest();
        getCover.open( "POST", url, true );
        getCover.setRequestHeader('Client-ID', "fwjbd711sjss17utbfjasiuraxpjo6");
        getCover.setRequestHeader('Access-Control-Allow-Origin', "*");
        getCover.setRequestHeader("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
        getCover.setRequestHeader('Authorization', auth);
        getCover.onload = function() {
            coverResponse = JSON.parse(getCover.response);
            console.log(coverResponse);
            var uri = coverResponse[0].url;
            uri = uri.replace('t_thumb', 't_cover_big');
            console.log(HtmlId);
            document.getElementById(HtmlId).setAttribute('src', "https:"+uri);
        };
        getCover.send( payload );
    };
    getGameId.send( payload );
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
    console.log(jsonResponse);
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
    console.log(response);
    return response;
}

function searchButton() {
    let searchString = document.getElementById("search").value;
    window.location.href = "./Results.html?search="+searchString;
}


$(document).ready(function($) {

    $("#searchForm").submit(function() {
        searchButton();
        return false;
    });

    buildQuery();

});