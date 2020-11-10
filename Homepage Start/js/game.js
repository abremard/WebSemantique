
function fillInfo(JSONresponse) {
    // document.getElementById("game-title").innerText = JSONresponse.;
}

function sendRequest() {
    var gameURI = window.location.search.split("=")[1];
    var url = gameURI+"&format=JSON";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    response = JSON.parse(xmlHttp.response);
    return response;
}


$(document).ready(function($) {
    var JSONresponse = sendRequest();
    fillInfo(JSONresponse);

});