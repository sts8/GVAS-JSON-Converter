const {writeUint32} = require("../value-writer");

class StrProperty {
    type = "StrProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(9); // content length (4) + padding (4) + content start marker (1)
        this.value = savReader.readString();
    }

    toBytes() {
        const {writeString} = require("../value-writer");

        let contentLength = 4 + this.value.length; // value length (4)
        if (this.value.length > 0) {
            contentLength++; // string terminator (1)
        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentLength),
            0x00, 0x00, 0x00, 0x00, // padding (4)
            0x00, // content start marker (1)
            ...writeString(this.value)
        ]);
    }
}

module.exports = StrProperty;
