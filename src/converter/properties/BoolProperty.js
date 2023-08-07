class BoolProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "BoolProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(BoolProperty.padding.length);
        this.value = savReader.readBoolean();
        savReader.readBytes(1);
    }

    toBytes() {
        const {writeString} = require("../value-writer");

        let result = new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...BoolProperty.padding
        ]);

        if (this.value === true) {
            result = new Uint8Array([...result, 0x01]);
        } else {
            result = new Uint8Array([...result, 0x00]);
        }

        return new Uint8Array([...result, 0x00]);
    }
}

module.exports = BoolProperty;
