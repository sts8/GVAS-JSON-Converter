const {SavReader} = require("./sav-reader");
const {assignPrototype} = require("./properties");

function convertSavToJson(savFileArrayBuffer) {
    const parsedContent = new SavReader(savFileArrayBuffer).readWholeBuffer();
    return JSON.stringify(parsedContent, null, 2);
}

function convertJsonToSav(jsonString) {
    let output = new Uint8Array(0);

    for (const property of JSON.parse(jsonString)) {
        assignPrototype(property);
        output = new Uint8Array([...output, ...property.toBytes()]);
    }

    return output;
}

module.exports = {
    convertSavToJson,
    convertJsonToSav
};
