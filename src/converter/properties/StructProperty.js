import SavWriter from '../sav-writer.js';
import {assignPrototype} from '../converter.js';

class StructProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = 'StructProperty';

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.skipBytes(4); // padding
        this.subtype = savReader.readString();

        this.guid = savReader.readBytes(16);
        savReader.skipBytes(1);

        const contentEndPosition = savReader.offset + contentSize;

        if (this.subtype === 'Guid') {
            this.value = savReader.readBytes(16);
            return this;
        }

        if (this.subtype === 'DateTime') {
            this.value = savReader.readInt64();
            return this;
        }

        if (this.subtype === 'Vector2D') {
            this.value = '(' + savReader.readFloat64() + '/' + savReader.readFloat64() + ')';
            return this;
        }

        this.value = [];

        while (savReader.offset < contentEndPosition) {
            this.value.push(savReader.readProperty());
        }
    }

    toBytes() {
        const writer = new SavWriter();

        if (this.subtype === 'Guid') {
            writer.writeString(this.name);
            writer.writeString(this.type);
            writer.writeUInt32(16);
            writer.writeArray(StructProperty.padding);
            writer.writeString('Guid');
            writer.writeHex(this.guid + '00');
            writer.writeHex(this.value);
            return writer.result;
        }

        if (this.subtype === 'DateTime') {
            writer.writeString(this.name);
            writer.writeString(this.type);
            writer.writeUInt32(8);
            writer.writeArray(StructProperty.padding);
            writer.writeString('DateTime');
            writer.writeHex(this.guid + '00');
            writer.writeInt64(this.value);
            return writer.result;
        }

        if (this.subtype === 'Vector2D') {
            const [x, y] = this.value.slice(1, -1).split('/');
            writer.writeString(this.name);
            writer.writeString(this.type);
            writer.writeUInt32(16);
            writer.writeArray(StructProperty.padding);
            writer.writeString('Vector2D');
            writer.writeHex(this.guid + '00');
            writer.writeFloat64(x);
            writer.writeFloat64(y);
            return writer.result;
        }

        const contentWriter = new SavWriter();
        for (let i = 0; i < this.value.length; i++) {
            if (Array.isArray(this.value[i])) {
                for (let j = 0; j < this.value[i].length; j++) {
                    contentWriter.writeArray(assignPrototype(this.value[i][j]).toBytes());
                }
            } else {
                contentWriter.writeArray(assignPrototype(this.value[i]).toBytes());
            }
        }
        const content = contentWriter.result;

        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeUInt32(content.length);
        writer.writeArray(StructProperty.padding);
        writer.writeString(this.subtype);
        writer.writeHex(this.guid + '00');
        writer.writeArray(content);
        return writer.result;
    }
}

export default StructProperty;
