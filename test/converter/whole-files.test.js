import fs from "fs";
import path from "path";
import test from "node:test";
import assert from "node:assert/strict";

import {convertSavToJson, convertJsonToSav} from "../../src/converter/converter.js";

const folderPath = "./tests/converter/whole-files/";

for (const fileName of fs.readdirSync(folderPath)) {
    test(fileName, () => {
        const savArray = new Uint8Array(fs.readFileSync(path.join(folderPath, fileName)));
        const jsonString = convertSavToJson(savArray.buffer);
        const resultSavArray = convertJsonToSav(jsonString);

        assert.deepStrictEqual(resultSavArray, savArray);
    });
}
