import SavWriter from '../sav-writer.js';

class SetProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = 'SetProperty';

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.skipBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.skipBytes(1);

        if (this.subtype === 'StructProperty') {
            savReader.skipBytes(4); // padding
            const contentCount = savReader.readUInt32();
            this.value = [];
            for (let i = 0; i < contentCount; i++) {
                this.value.push(savReader.readBytes(16));
            }
            return this;
        }

        this.value = savReader.readBytes(contentSize);
    }

    write(writer) {
        if (this.subtype === 'StructProperty') {
            const contentCount = this.value.length;

            const contentWriter = new SavWriter();
            for (let i = 0; i < contentCount; i++) {
                contentWriter.writeHex(this.value[i]);
            }
            const content = contentWriter.result;

            writer.writeString(this.name);
            writer.writeString(this.type);
            writer.writeUInt32(4 + 4 + content.length);
            writer.writeArray(SetProperty.padding);
            writer.writeString(this.subtype);
            writer.writeByte(0x00);
            writer.writeArray(SetProperty.padding);
            writer.writeUInt32(contentCount);
            writer.writeArray(content);
            return;
        }

        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeUInt32(this.value.length / 2);
        writer.writeArray(SetProperty.padding);
        writer.writeString(this.subtype);
        writer.writeByte(0x00);
        writer.writeHex(this.value);
    }
}

export default SetProperty;
