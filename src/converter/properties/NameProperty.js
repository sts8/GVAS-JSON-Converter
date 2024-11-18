const {writeUint32} = require("../value-writer");

// copied StrProperty
class NameProperty {
    type = "NameProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(9); // content length (4) + padding (4) + content start marker (1)
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString} = require("../value-writer");

        const contentLength = this.value.length + 5; // string terminator (1) + value length (4)

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentLength),
            0x00, 0x00, 0x00, 0x00, 0x00,
            ...writeString(this.value)
        ]);
    }
}

module.exports = NameProperty;
