
$(document).ready(function($) {

    $("#searchForm").submit(function() {
        searchButton();
        return false;
    });

});

function chooseWallpaper() {
    var elem = document.getElementById("background");
    var num = Math.floor((Math.random()*3) + 1);
    var photo = "url(./images/" + num + ".png)";
    elem.style.background = photo;
}

// $(document).keypress(function(event){
//     var keycode = (event.keyCode ? event.keyCode : event.which);
//     if(keycode === '13'){
//         alert('You pressed a "enter" key in somewhere');
//     }
// });