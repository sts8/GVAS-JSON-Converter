class BoolProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "BoolProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(BoolProperty.padding.length);
        this.value = savReader.readBoolean();
        savReader.skipBytes(1);
    }

    toBytes() {
        const {writeString} = require("../value-writer");

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const padding = BoolProperty.padding;
        const boolByte = this.value ? 0x01 : 0x00;

        const totalLength = nameBytes.length + typeBytes.length + padding.length + 2;
        const result = new Uint8Array(totalLength);

        let offset = 0;
        result.set(nameBytes, offset);
        offset += nameBytes.length;

        result.set(typeBytes, offset);
        offset += typeBytes.length;

        result.set(padding, offset);
        offset += padding.length;

        result[offset++] = boolByte;
        result[offset++] = 0x00;

        return result;
    }
}

module.exports = BoolProperty;
