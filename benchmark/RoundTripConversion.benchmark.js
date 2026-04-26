import fs from 'fs';
import {convertJsonToSav, convertSavToJson} from '../src/converter/converter.js';
import Timer from './Timer.js';

function measureRoundTrip() {
    const timer = new Timer();

    const savFile = new Uint8Array(fs.readFileSync(import.meta.dirname + '/../test/converter/whole-files/drg2.sav'));
    timer.mark('read file');

    const jsonString = convertSavToJson(savFile);
    timer.mark('convert to JSON');

    convertJsonToSav(jsonString);
    timer.mark('convert back to SAV');

    timer.report();
}

measureRoundTrip();
