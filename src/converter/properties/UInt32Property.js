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

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const paddingBytes = UInt32Property.padding;
        const valueBytes = writeUint32(this.value);

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

module.exports = UInt32Property;
