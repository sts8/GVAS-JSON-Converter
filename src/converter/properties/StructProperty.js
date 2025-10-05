import {writeString, writeUint32, writeInt64, writeFloat64, writeBytes} from "../value-writer.js";
import {assignPrototype} from "../converter.js";

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

        if (this.subtype === "Vector2D") {
            this.value = "(" + savReader.readFloat64() + "/" + savReader.readFloat64() + ")";
            return this;
        }

        this.value = [];

        while (savReader.offset < contentEndPosition) {
            this.value.push(savReader.readProperty());
        }
    }

    toBytes() {


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

        if (this.subtype === "Vector2D") {
            const vector = this.value.slice(1, -1).split("/");
            const x = vector[0];
            const y = vector[1];

            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(16),
                ...StructProperty.padding,
                ...writeString("Vector2D"),
                ...writeBytes(this.guid + "00"),
                ...writeFloat64(x),
                ...writeFloat64(y)
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

export default StructProperty;
