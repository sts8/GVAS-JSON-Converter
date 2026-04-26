import SavWriter from '../sav-writer.js';

class EnumProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = 'EnumProperty';

    constructor(name, savReader) {
        this.name = name;
        this.type = 'EnumProperty';
        savReader.readUInt32(); // contentSize
        savReader.skipBytes(EnumProperty.padding.length);
        this.enum = savReader.readString();
        savReader.skipBytes(1);
        this.value = savReader.readString();
    }

    toBytes() {
        const writer = new SavWriter();
        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeUInt32(4 + this.value.length + 1);
        writer.writeArray(EnumProperty.padding);
        writer.writeString(this.enum);
        writer.writeByte(0x00);
        writer.writeString(this.value);
        return writer.result;
    }
}

export default EnumProperty;
