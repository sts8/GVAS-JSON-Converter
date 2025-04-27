class Int64Property {
    static padding = new Uint8Array([
        0x08, // size of value?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "Int64Property";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(Int64Property.padding.length);
        this.value = savReader.readInt64();
    }

    toBytes() {
        const {writeString, writeInt64} = require("../value-writer");

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const paddingBytes = Int64Property.padding;
        const valueBytes = writeInt64(this.value);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            paddingBytes.length +
            valueBytes.length;

        const output = new Uint8Array(totalLength);

        let offset = 0;
        output.set(nameBytes, offset);
        offset += nameBytes.length;

        output.set(typeBytes, offset);
        offset += typeBytes.length;

        output.set(paddingBytes, offset);
        offset += paddingBytes.length;

        output.set(valueBytes, offset);

        return output;
    }
}

module.exports = Int64Property;
