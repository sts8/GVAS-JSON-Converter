class ObjectProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "ObjectProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.skipBytes(5); // padding
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const contentSizeBytes = writeUint32(4 + this.value.length + 1);
        const paddingBytes = ObjectProperty.padding;
        const valueBytes = writeString(this.value);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            contentSizeBytes.length +
            paddingBytes.length +
            valueBytes.length;

        const output = new Uint8Array(totalLength);

        let offset = 0;
        output.set(nameBytes, offset);
        offset += nameBytes.length;

        output.set(typeBytes, offset);
        offset += typeBytes.length;

        output.set(contentSizeBytes, offset);
        offset += contentSizeBytes.length;

        output.set(paddingBytes, offset);
        offset += paddingBytes.length;

        output.set(valueBytes, offset);

        return output;
    }
}

module.exports = ObjectProperty;
