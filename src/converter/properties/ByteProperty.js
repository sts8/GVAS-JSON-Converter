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
        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const lengthBytes = writeUint32(this.value.length / 2);
        const subtypeBytes = writeString(this.subtype);
        const valueBytes = writeBytes(this.value);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            lengthBytes.length +
            4 + // four zero bytes
            subtypeBytes.length +
            1 + // single zero byte
            valueBytes.length;

        const output = new Uint8Array(totalLength);

        let offset = 0;
        output.set(nameBytes, offset);
        offset += nameBytes.length;

        output.set(typeBytes, offset);
        offset += typeBytes.length;

        output.set(lengthBytes, offset);
        offset += lengthBytes.length;

        output.set([0x00, 0x00, 0x00, 0x00], offset);
        offset += 4;

        output.set(subtypeBytes, offset);
        offset += subtypeBytes.length;

        output[offset++] = 0x00;

        output.set(valueBytes, offset);

        return output;
    }
}

module.exports = ByteProperty;
