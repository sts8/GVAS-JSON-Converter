class StrProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "StrProperty";

    constructor(name, savReader) {
        this.name = name;
        this.unknown = savReader.readBytes(1);
        savReader.readBytes(StrProperty.padding.length);
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString, writeBytes} = require("../value-writer");

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeBytes(this.unknown),
            ...StrProperty.padding,
            ...writeString(this.value)
        ]);
    }
}

module.exports = StrProperty;
