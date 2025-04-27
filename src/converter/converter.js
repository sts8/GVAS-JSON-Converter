const SavReader = require("./sav-reader");
const properties = require("./properties");

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
    let output = new Uint8Array(0);

    for (const property of JSON.parse(jsonString)) {
        output = new Uint8Array([...output, ...assignPrototype(property).toBytes()]);
    }

    return output;
}

module.exports = {
    convertSavToJson,
    convertJsonToSav,
    assignPrototype
};
