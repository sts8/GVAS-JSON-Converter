class ObjectProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "ObjectProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.readBytes(5); // padding
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        const contentSize = 4 + this.value.length + 1;

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...ObjectProperty.padding,
            ...writeString(this.value)
        ]);
    }
}

module.exports = ObjectProperty;
