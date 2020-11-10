function searchButton() {
    let searchString = document.getElementById("search").value;
    window.location.href = "./Results.html?search="+searchString;
}

$(document).ready(function($) {

    $("#search").keyup(function(ev) {

        // console.log("keyup");
        // 13 = ENTER
        if (ev.which === 13) {
            // console.log("enter on input field");
            searchButton();
        }

        // console.log(ev.which);
    });

});

$(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === '13'){
        alert('You pressed a "enter" key in somewhere');
    }
});