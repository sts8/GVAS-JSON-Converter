class SetProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "SetProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.readBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.readBytes(1);

        if (this.subtype === "StructProperty") {

            savReader.readBytes(4); // padding

            const contentCount = savReader.readUInt32();
            this.value = [];
            for (let i = 0; i < contentCount; i++) {
                this.value.push(savReader.readBytes(16));
            }
            return this;
        }

        this.value = savReader.readBytes(contentSize);
    }

    toBytes() {
        const {writeBytes, writeString, writeUint32} = require("../value-writer");

        if (this.subtype === "StructProperty") {

            const contentCount = this.value.length;
            let byteArrayContent = new Uint8Array(0);

            for (let i = 0; i < contentCount; i++) {
                byteArrayContent = new Uint8Array([...byteArrayContent, ...writeBytes(this.value[i])]);
            }

            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(4 + 4 + byteArrayContent.length),
                ...SetProperty.padding,
                ...writeString(this.subtype),
                0x00,
                ...SetProperty.padding,
                ...writeUint32(contentCount),
                ...byteArrayContent
            ]);
        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(this.value.length / 2),
            ...SetProperty.padding,
            ...writeString(this.subtype),
            0x00,
            ...writeBytes(this.value)
        ]);
    }
}

module.exports = SetProperty;
