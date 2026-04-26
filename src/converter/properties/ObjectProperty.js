import SavWriter from '../sav-writer.js';

class ObjectProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    type = 'ObjectProperty';

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.skipBytes(5); // padding
        this.value = savReader.readString();
    }

    toBytes() {
        const writer = new SavWriter();
        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeUInt32(4 + this.value.length + 1);
        writer.writeArray(ObjectProperty.padding);
        writer.writeString(this.value);
        return writer.result;
    }
}

export default ObjectProperty;
