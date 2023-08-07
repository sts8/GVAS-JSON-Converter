const fs = require("fs");
const {convertSavToJson, convertJsonToSav} = require("../../src/converter/converter");

const path = "./tests/converter/whole-files/";

test.each(fs.readdirSync(path))("%s", (name) => {

    const savArray = new Uint8Array(fs.readFileSync(path + name));
    const jsonString = convertSavToJson(savArray.buffer);
    const resultSavArray = convertJsonToSav(jsonString);

    expect(resultSavArray).toEqual(savArray);
});
