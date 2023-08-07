const {convertJsonToSav, convertSavToJson} = require("../converter/converter");

function downloadJson(filename, jsonString) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(jsonString));
    element.setAttribute("download", filename);
    element.click();
}

function downloadSav(filename, savArrayBuffer) {
    const blob = new Blob([savArrayBuffer], {type: "octet/stream"});

    const element = document.createElement("a");
    element.setAttribute("href", window.URL.createObjectURL(blob));
    element.setAttribute("download", filename);
    element.click();
}

function loadSavFile() {
    const fileReader = new FileReader();
    fileReader.fileName = this.files[0].name;

    fileReader.onload = function (e) {
        downloadJson(fileReader.fileName + ".json", convertSavToJson(e.target.result));
    };

    fileReader.readAsArrayBuffer(this.files[0]);
}

function loadJsonFile() {
    const fileReader = new FileReader();
    fileReader.fileName = this.files[0].name;

    fileReader.onload = function (e) {
        downloadSav(fileReader.fileName + ".sav", convertJsonToSav(e.target.result));
    };

    fileReader.readAsText(this.files[0]);
}

document.getElementById("sav-input").addEventListener("change", loadSavFile);
document.getElementById("json-input").addEventListener("change", loadJsonFile);
