const SavReader = require("./sav-reader");
const {
    HeaderProperty, NoneProperty, BoolProperty, IntProperty, UInt32Property, Int64Property, StrProperty,
    EnumProperty, FloatProperty, StructProperty, ArrayProperty, MulticastInlineDelegateProperty, MapProperty,
    SetProperty, ObjectProperty, ByteProperty, FileEndProperty
} = require("./properties");

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

function assignPrototype(rawProperty) {
    switch (rawProperty.type) {
        case "HeaderProperty":
            return Object.setPrototypeOf(rawProperty, HeaderProperty.prototype);
        case "NoneProperty":
            return Object.setPrototypeOf(rawProperty, NoneProperty.prototype);
        case "BoolProperty":
            return Object.setPrototypeOf(rawProperty, BoolProperty.prototype);
        case "IntProperty":
            return Object.setPrototypeOf(rawProperty, IntProperty.prototype);
        case "UInt32Property":
            return Object.setPrototypeOf(rawProperty, UInt32Property.prototype);
        case "Int64Property":
            return Object.setPrototypeOf(rawProperty, Int64Property.prototype);
        case "StrProperty":
            return Object.setPrototypeOf(rawProperty, StrProperty.prototype);
        case "EnumProperty":
            return Object.setPrototypeOf(rawProperty, EnumProperty.prototype);
        case "FloatProperty":
            return Object.setPrototypeOf(rawProperty, FloatProperty.prototype);
        case "StructProperty":
            return Object.setPrototypeOf(rawProperty, StructProperty.prototype);
        case "ArrayProperty":
            return Object.setPrototypeOf(rawProperty, ArrayProperty.prototype);
        case "MulticastInlineDelegateProperty":
            return Object.setPrototypeOf(rawProperty, MulticastInlineDelegateProperty.prototype);
        case "MapProperty":
            return Object.setPrototypeOf(rawProperty, MapProperty.prototype);
        case "SetProperty":
            return Object.setPrototypeOf(rawProperty, SetProperty.prototype);
        case "ObjectProperty":
            return Object.setPrototypeOf(rawProperty, ObjectProperty.prototype);
        case "ByteProperty":
            return Object.setPrototypeOf(rawProperty, ByteProperty.prototype);
        case "FileEndProperty":
            return Object.setPrototypeOf(rawProperty, FileEndProperty.prototype);
        default:
            throw new Error("Unknown property type: " + rawProperty.type);
    }
}

module.exports = {
    convertSavToJson,
    convertJsonToSav,
    assignPrototype
};
