import fs from 'fs';
import path from 'path';
import {expect, test} from 'vitest';

import {convertJsonToSav, convertSavToJson} from '../../src/converter/converter.js';

const folderPath = './test/converter/whole-files/';

for (const fileName of fs.readdirSync(folderPath)) {
    test(fileName, () => {
        const savArray = new Uint8Array(fs.readFileSync(path.join(folderPath, fileName)));
        const jsonString = convertSavToJson(savArray.buffer);
        const resultSavArray = convertJsonToSav(jsonString);

        expect(resultSavArray).toStrictEqual(savArray);
    });
}
