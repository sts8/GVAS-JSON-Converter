class FloatProperty {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    type = "FloatProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(FloatProperty.padding.length);
        this.value = savReader.readFloat32();
    }

    toBytes() {
        const {writeString, writeFloat32} = require("../value-writer");

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...FloatProperty.padding,
            ...writeFloat32(this.value)
        ]);
    }
}

module.exports = FloatProperty;
