import SavReader from './sav-reader.js';
import SavWriter from './sav-writer.js';
import * as properties from './properties/index.js';

// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006088574
BigInt.prototype['toJSON'] = function () {
    return this.toString();
};

function assignPrototype(rawProperty) {
    const PropertyClass = properties[rawProperty.type];

    if (!PropertyClass) {
        throw new Error('Unknown property type: ' + rawProperty.type);
    }

    const instance = Object.create(PropertyClass.prototype);
    Object.assign(instance, rawProperty);
    return instance;
}

function convertSavToJson(bytes) {
    const parsedContent = new SavReader(bytes).readWholeBuffer();
    return JSON.stringify(parsedContent, null, 2);
}

function convertJsonToSav(jsonString) {
    const rawProperties = JSON.parse(jsonString);
    const writer = new SavWriter();
    for (const rawProperty of rawProperties) {
        assignPrototype(rawProperty).write(writer);
    }
    return writer.result;
}

export {convertSavToJson, convertJsonToSav, assignPrototype};
