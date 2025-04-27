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

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const valueBytes = writeInt32(this.value);
        const padding = IntProperty.padding;

        const totalLength = nameBytes.length + typeBytes.length + padding.length + valueBytes.length;
        const result = new Uint8Array(totalLength);

        let offset = 0;
        result.set(nameBytes, offset);
        offset += nameBytes.length;

        result.set(typeBytes, offset);
        offset += typeBytes.length;

        result.set(padding, offset);
        offset += padding.length;

        result.set(valueBytes, offset);

        return result;
    }
}

module.exports = IntProperty;
