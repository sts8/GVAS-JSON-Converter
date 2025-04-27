const fs = require("fs");
const path = require("path");

const {convertSavToJson, convertJsonToSav} = require("../src/converter/converter");
const Timer = require("./Timer");

function measureRoundTrip() {
    const timer = new Timer();
    timer.mark('start');

    const savFile = fs.readFileSync(path.resolve(__dirname, '../tests/converter/whole-files/drg2.sav'));
    timer.mark('read file');

    const savArray = new Uint8Array(savFile);
    timer.mark('create Uint8Array');

    const jsonString = convertSavToJson(savArray.buffer);
    timer.mark('convert to JSON');

    convertJsonToSav(jsonString);
    timer.mark('convert back to SAV');

    timer.report();
}

measureRoundTrip();
