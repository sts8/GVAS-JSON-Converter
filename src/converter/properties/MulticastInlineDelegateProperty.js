class MulticastInlineDelegateProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    static unknown = new Uint8Array([0x01, 0x00, 0x00, 0x00]);
    type = "MulticastInlineDelegateProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.readBytes(5); // padding
        savReader.readBytes(4); // unknown
        this.object_name = savReader.readString();
        this.function_name = savReader.readString();
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        const contentSize =
            MulticastInlineDelegateProperty.unknown.length
            + 4 + this.object_name.length + 1
            + 4 + this.function_name.length + 1;

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...MulticastInlineDelegateProperty.padding,
            ...MulticastInlineDelegateProperty.unknown,
            ...writeString(this.object_name),
            ...writeString(this.function_name)
        ]);
    }
}

module.exports = MulticastInlineDelegateProperty;
