import SavReader from "./sav-reader.js";
import * as properties from "./properties/index.js";

// https://github.com/GoogleChromeLabs/jsbi/issues/30#issuecomment-1006088574
BigInt.prototype["toJSON"] = function () {
    return this.toString();
};

function assignPrototype(rawProperty) {
    const PropertyClass = properties[rawProperty.type];

    if (!PropertyClass) {
        throw new Error("Unknown property type: " + rawProperty.type);
    }

    const instance = Object.create(PropertyClass.prototype);
    Object.assign(instance, rawProperty);
    return instance;
}

function convertSavToJson(savFileArrayBuffer) {
    const parsedContent = new SavReader(savFileArrayBuffer).readWholeBuffer();
    return JSON.stringify(parsedContent, null, 2);
}

function convertJsonToSav(jsonString) {
    const rawProperties = JSON.parse(jsonString);

    const byteArrays = rawProperties.map(rawProperty => {
        const typedProperty = assignPrototype(rawProperty);
        return typedProperty.toBytes();
    });

    const totalLength = byteArrays.reduce((sum, arr) => sum + arr.length, 0);
    const output = new Uint8Array(totalLength);

    let offset = 0;
    for (const bytes of byteArrays) {
        output.set(bytes, offset);
        offset += bytes.length;
    }

    return output;
}

export {convertSavToJson, convertJsonToSav, assignPrototype};
