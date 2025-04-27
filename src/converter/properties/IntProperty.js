class IntProperty {
    static padding = new Uint8Array([
        0x04,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "IntProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(IntProperty.padding.length);
        this.value = savReader.readInt32();
    }

    toBytes() {
        const {writeString, writeInt32} = require("../value-writer");

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...IntProperty.padding,
            ...writeInt32(this.value)
        ]);
    }
}

module.exports = IntProperty;
