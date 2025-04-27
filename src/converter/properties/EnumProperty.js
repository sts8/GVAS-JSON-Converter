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

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const contentSizeBytes = writeUint32(4 + this.value.length + 1);
        const enumBytes = writeString(this.enum);
        const valueBytes = writeString(this.value);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            contentSizeBytes.length +
            EnumProperty.padding.length +
            enumBytes.length +
            1 +
            valueBytes.length;

        const output = new Uint8Array(totalLength);

        let offset = 0;
        output.set(nameBytes, offset);
        offset += nameBytes.length;

        output.set(typeBytes, offset);
        offset += typeBytes.length;

        output.set(contentSizeBytes, offset);
        offset += contentSizeBytes.length;

        output.set(EnumProperty.padding, offset);
        offset += EnumProperty.padding.length;

        output.set(enumBytes, offset);
        offset += enumBytes.length;

        output[offset++] = 0x00;

        output.set(valueBytes, offset);

        return output;
    }
}

module.exports = EnumProperty;
