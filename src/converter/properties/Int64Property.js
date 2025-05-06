class Int64Property {

    constructor(name, savReader) {
        this.name = name;
        this.type = "Int64Property";
        this.unknown = savReader.readBytes(25);
        this.value = savReader.readInt64();
    }

    toBytes() {
        const {writeString, writeBytes, writeInt64} = require("../value-writer");

        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const unknownBytes = writeBytes(this.unknown);
        const valueBytes = writeInt64(this.value);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            unknownBytes.length +
            valueBytes.length;

        const output = new Uint8Array(totalLength);

        let offset = 0;
        output.set(nameBytes, offset);
        offset += nameBytes.length;

        output.set(typeBytes, offset);
        offset += typeBytes.length;

        output.set(unknownBytes, offset);
        offset += unknownBytes.length;

        output.set(valueBytes, offset);

        return output;
    }
}

module.exports = Int64Property;
