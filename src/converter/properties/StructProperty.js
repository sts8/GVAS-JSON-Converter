class StructProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "StructProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.skipBytes(4); // padding
        this.subtype = savReader.readString();

        this.guid = savReader.readBytes(16);
        savReader.skipBytes(1);

        const contentEndPosition = savReader.offset + contentSize;

        if (this.subtype === "Guid") {
            this.value = savReader.readBytes(16);
            return this;
        }

        if (this.subtype === "DateTime") {
            this.value = savReader.readInt64();
            return this;
        }

        this.value = [];

        while (savReader.offset < contentEndPosition) {
            this.value.push(savReader.readProperty());
        }
    }

    toBytes() {
        const {writeString, writeUint32, writeInt64, writeBytes} = require("../value-writer");
        const {assignPrototype} = require("../converter");

        if (this.subtype === "Guid") {
            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(16),
                ...StructProperty.padding,
                ...writeString("Guid"),
                ...writeBytes(this.guid + "00"),
                ...writeBytes(this.value)
            ]);
        }

        if (this.subtype === "DateTime") {
            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(8),
                ...StructProperty.padding,
                ...writeString("DateTime"),
                ...writeBytes(this.guid + "00"),
                ...writeInt64(this.value)
            ]);
        }

        let contentBytes = new Uint8Array(0);

        for (let i = 0; i < this.value.length; i++) {

            if (Array.isArray(this.value[i])) {

                for (let j = 0; j < this.value[i].length; j++) {
                    contentBytes = new Uint8Array([...contentBytes, ...assignPrototype(this.value[i][j]).toBytes()]);
                }

            } else {
                contentBytes = new Uint8Array([...contentBytes, ...assignPrototype(this.value[i]).toBytes()]);
            }
        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentBytes.length),
            ...StructProperty.padding,
            ...writeString(this.subtype),
            ...writeBytes(this.guid + "00"),
            ...contentBytes
        ]);
    }
}

module.exports = StructProperty;
