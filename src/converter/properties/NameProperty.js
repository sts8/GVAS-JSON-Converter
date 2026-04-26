import SavWriter from '../sav-writer.js';

class NameProperty {
    type = 'NameProperty';

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(9); // content length (4) + padding (4) + content start marker (1)
        this.value = savReader.readString();
    }

    toBytes() {
        const writer = new SavWriter();
        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeUInt32(4 + this.value.length + 1);
        writer.writeUInt32(0); // padding
        writer.writeByte(0x00); // content start marker
        writer.writeString(this.value);
        return writer.result;
    }
}

export default NameProperty;
