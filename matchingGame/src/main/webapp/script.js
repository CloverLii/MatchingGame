
function makeTable(container, data) {
    let table = $("<table/>");
    let id = 0;
    $.each(data, function(rowIndex, r) {
        let row = $("<tr/>");
        $.each(r, function(colIndex, c) {
            row.append(
                $("<td/>").append(
                    $("<img/>", {
                        src: c,
                        class: "hide"
                    }).click(function() {
                        onImageclick(rowIndex, colIndex);
                    })
                )
            );
        });
        table.append(row);
    });
    return container.append(table);
}

function newMatchingGame(name_arr) {
    let game_arr = name_arr.concat(name_arr);

    shuffle(game_arr);
    let data = [
        game_arr.splice(0, 4),
        game_arr.splice(0, 4),
        game_arr.splice(0, 4),
        game_arr
    ];
    let container = $("#matchingGameTable").empty();
    makeTable(container, data);
}

function resetMatchingGame() {
    // initiating an XMLHttpRequest
    let nameArr = [];
    let xmlHttpReq = null;
    $("#replayButton").attr("class", "hidden");
    if (window.XMLHttpRequest) {
        xmlHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // for IE
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        xmlHttpReq = new XMLHttpRequest();
    }
//this url retrieves a image file name from the server:
    let url = "http://localhost:8080/matchinggame";

    xmlHttpReq.open('GET', url, true);
    xmlHttpReq.onreadystatechange = function () {
        if (xmlHttpReq.readyState == 4 && xmlHttpReq.status == 200) {
            nameArr = xmlHttpReq.responseText.split(",");
            newMatchingGame(nameArr);
        }
    }
    xmlHttpReq.send();

    return nameArr;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}

var gPrevRow = -1;
var gPrevCol = -1;
function onImageclick(row, col) {
    let img = $("#matchingGameTable tr:eq("+row+") td:eq("+col+") img");
    if (img.hasClass("matched")) {
        if (gPrevCol >= 0 && gPrevRow >= 0) {
            let preImg = $("#matchingGameTable tr:eq("+gPrevRow+") td:eq("+gPrevCol+") img");
            preImg.attr("class", "hide");
            gPrevRow = -1;
            gPrevCol = -1;
        }

        return;
    }
    img.attr("class", "show");

    if (gPrevCol < 0 || gPrevRow < 0) {
        gPrevRow = row;
        gPrevCol = col;
        return;
    }

    if (gPrevRow == row && gPrevCol == col) {
        img.attr("class", "hide");
        gPrevRow = -1;
        gPrevCol = -1;
        return;
    }

    let preImg = $("#matchingGameTable tr:eq("+gPrevRow+") td:eq("+gPrevCol+") img");
    if (preImg.attr("src") != img.attr("src")) {
        setTimeout(function () {
            img.attr("class", "hide");
            preImg.attr("class", "hide");
        }, 300);

        gPrevCol = -1;
        gPrevRow = -1;
        return;;
    }

    //match
    preImg.attr("class", "matched");
    img.attr("class", "matched");

    gPrevRow = -1;
    gPrevCol = -1;

    if ($("#matchingGameTable img[class*=matched]").length == 16) {
        setTimeout(function () {
            alert("Victory!");
            $("#replayButton").attr("class", "display");
        }, 500);
    }
}