const NoneProperty = require("./NoneProperty");

class ArrayProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    static unknown = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "ArrayProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.readBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.readBytes(1);

        switch (this.subtype) {
            case "StructProperty":
                const contentCount = savReader.readUInt32();

                const nameAgain = savReader.readString();
                if (nameAgain !== this.name) throw new Error();

                const subtypeAgain = savReader.readString();
                if (subtypeAgain !== this.subtype) throw new Error();

                savReader.readUInt32(); // arraySize
                savReader.readBytes(4); // padding

                this.genericType = savReader.readString();

                const unknown = savReader.readBytes(17);
                if (unknown !== "0000000000000000000000000000000000") throw new Error();

                this.value = [];

                switch (this.genericType) {
                    case "Guid":
                        for (let i = 0; i < contentCount; i++) {
                            this.value.push(savReader.readBytes(16));
                        }
                        break;

                    default:

                        for (let i = 0; i < contentCount; i++) {
                            const structElementInstance = [];

                            let structElementInstanceChildProperty = null;

                            while (!(structElementInstanceChildProperty instanceof NoneProperty)) {
                                structElementInstanceChildProperty = savReader.readProperty();
                                structElementInstance.push(structElementInstanceChildProperty);

                            }

                            this.value.push(structElementInstance);
                        }
                }

                break;

            default:
                this.value = savReader.readBytes(contentSize);
        }
    }

    toBytes() {
        const {writeBytes, writeString, writeUint32} = require("../value-writer");
        const {assignPrototype} = require("../converter");

        const contentCount = this.value.length;
        let byteArrayContent = new Uint8Array(0);

        let contentSize;

        switch (this.subtype) {
            case "StructProperty":

                switch (this.genericType) {
                    case "Guid":
                        for (let i = 0; i < contentCount; i++) {
                            byteArrayContent = new Uint8Array([...byteArrayContent, ...writeBytes(this.value[i])]);
                        }
                        break;

                    default:
                        for (let i = 0; i < contentCount; i++) {

                            if (Array.isArray(this.value[i])) {
                                for (let j = 0; j < this.value[i].length; j++) {
                                    assignPrototype(this.value[i][j]);
                                    byteArrayContent = new Uint8Array([...byteArrayContent, ...this.value[i][j].toBytes()]);
                                }
                            } else {
                                assignPrototype(this.value[i]);
                                byteArrayContent = new Uint8Array([...byteArrayContent, ...this.value[i].toBytes()]);
                            }
                        }
                }

                contentSize =
                    4
                    + 4 + this.name.length + 1
                    + 4 + this.subtype.length + 1
                    + 4
                    + ArrayProperty.padding.length
                    + 4 + this.genericType.length + 1
                    + ArrayProperty.unknown.length
                    + byteArrayContent.length;

                return new Uint8Array([
                    ...writeString(this.name),
                    ...writeString(this.type),
                    ...writeUint32(contentSize),
                    ...ArrayProperty.padding,
                    ...writeString(this.subtype),
                    0x00, // --- contentSize content below ---
                    ...writeUint32(contentCount),
                    ...writeString(this.name),
                    ...writeString(this.subtype),
                    ...writeUint32(byteArrayContent.length),
                    ...ArrayProperty.padding,
                    ...writeString(this.genericType),
                    ...ArrayProperty.unknown,
                    ...byteArrayContent
                ]);

            default:
                contentSize = this.value.length / 2;
                return new Uint8Array([
                    ...writeString(this.name),
                    ...writeString(this.type),
                    ...writeUint32(contentSize),
                    ...ArrayProperty.padding,
                    ...writeString(this.subtype),
                    0x00, // --- contentSize content below ---
                    ...writeBytes(this.value)
                ]);
        }
    }
}

module.exports = ArrayProperty;
