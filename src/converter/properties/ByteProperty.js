const {writeString, writeBytes, writeUint32} = require("../value-writer");

class ByteProperty {
    type = "ByteProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentLength = savReader.readUInt32();
        savReader.skipBytes(4);

        this.subtype = savReader.readString();
        savReader.skipBytes(1);
        this.value = savReader.readBytes(contentLength);
    }

    toBytes() {
        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(this.value.length / 2),
            0x00, 0x00, 0x00, 0x00,
            ...writeString(this.subtype),
            0x00,
            ...writeBytes(this.value)
        ]);
    }
}

module.exports = ByteProperty;
