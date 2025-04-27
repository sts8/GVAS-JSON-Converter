class UInt32Property {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "UInt32Property";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(UInt32Property.padding.length);
        this.value = savReader.readUInt32();
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...UInt32Property.padding,
            ...writeUint32(this.value)
        ]);
    }
}

module.exports = UInt32Property;
