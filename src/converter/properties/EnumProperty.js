class EnumProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "EnumProperty";

    constructor(name, savReader) {
        this.name = name;
        this.type = "EnumProperty";
        savReader.readUInt32(); // contentSize
        savReader.skipBytes(EnumProperty.padding.length);
        this.enum = savReader.readString();
        savReader.skipBytes(1);
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        const contentSize = 4 + this.value.length + 1;

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...EnumProperty.padding,
            ...writeString(this.enum),
            0x00,
            ...writeString(this.value)
        ]);
    }
}

module.exports = EnumProperty;
