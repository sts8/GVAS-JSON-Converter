import SavWriter, {getStringByteSize} from "../sav-writer.js";

class UInt32Property {
    static SIZE_FOUR = [0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = "UInt32Property";
        savReader.skipBytes(8); // contains value size

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        this.value = savReader.readUInt32();
    }

    getByteSize() {
        return getStringByteSize(this.name) + 32 + (this.hasGuid ? 16 : 0);
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);
        savWriter.writeArray(UInt32Property.SIZE_FOUR);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }

        savWriter.writeUInt32(this.value);
    }

    // backwards compatibility
    toBytes() {
        const savWriter = new SavWriter(this.getByteSize());
        this.write(savWriter);
        return savWriter.array;
    }
}

export default UInt32Property;
