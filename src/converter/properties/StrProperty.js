class StrProperty {
    type = "StrProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(9); // content length (4) + padding (4) + content start marker (1)
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const valueBytes = writeString(this.value);
        const contentLengthBytes = writeUint32(valueBytes.length);

        const padding = new Uint8Array(4); // 0x00, 0x00, 0x00, 0x00
        const contentStartMarker = new Uint8Array([0x00]);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            contentLengthBytes.length +
            padding.length +
            contentStartMarker.length +
            valueBytes.length;

        const result = new Uint8Array(totalLength);
        let offset = 0;

        result.set(nameBytes, offset);
        offset += nameBytes.length;

        result.set(typeBytes, offset);
        offset += typeBytes.length;

        result.set(contentLengthBytes, offset);
        offset += contentLengthBytes.length;

        result.set(padding, offset);
        offset += padding.length;

        result.set(contentStartMarker, offset);
        offset += contentStartMarker.length;

        result.set(valueBytes, offset);

        return result;
    }
}

module.exports = StrProperty;
