import fs from 'fs';
import {convertJsonToSav, convertSavToJson} from '../src/converter/converter.js';
import Timer from './Timer.js';

function measureRoundTrip() {
    const timer = new Timer();

    const savFile = fs.readFileSync(import.meta.dirname + '/../test/converter/whole-files/drg2.sav');
    timer.mark('read file');

    const buffer = savFile.buffer.slice(savFile.byteOffset, savFile.byteOffset + savFile.byteLength);
    timer.mark('create ArrayBuffer');

    const jsonString = convertSavToJson(buffer);
    timer.mark('convert to JSON');

    convertJsonToSav(jsonString);
    timer.mark('convert back to SAV');

    timer.report();
}

measureRoundTrip();
