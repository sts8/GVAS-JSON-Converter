import SavWriter from '../sav-writer.js';

class BoolProperty {
    static PADDING = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = 'BoolProperty';
        savReader.skipBytes(8); // contains padding

        this.value = savReader.readBoolean();

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);
        savWriter.writeArray(BoolProperty.PADDING);

        savWriter.writeBoolean(this.value);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }
    }

    toBytes() {
        const savWriter = new SavWriter();
        this.write(savWriter);
        return savWriter.result;
    }
}

export default BoolProperty;
