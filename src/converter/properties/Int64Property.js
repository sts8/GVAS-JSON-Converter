class Int64Property {
    static padding = new Uint8Array([
        0x08, // size of value?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "Int64Property";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(Int64Property.padding.length);
        this.value = savReader.readInt64();
    }

    toBytes() {
        const {writeString, writeInt64} = require("../value-writer");

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...Int64Property.padding,
            ...writeInt64(this.value)
        ]);
    }
}

module.exports = Int64Property;
