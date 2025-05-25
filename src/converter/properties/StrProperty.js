const {getStringByteSize} = require("../sav-writer");

class StrProperty {
    static PADDING = [0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = "StrProperty";
        savReader.skipBytes(8); // contains value size + padding

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        this.value = savReader.readString();
    }

    getByteSize() {
        return getStringByteSize(this.name) + 25 + (this.hasGuid ? 16 : 0) + getStringByteSize(this.value);
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);

        savWriter.writeUInt32((this.hasGuid ? 16 : 0) + getStringByteSize(this.value));
        savWriter.writeArray(StrProperty.PADDING);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }

        savWriter.writeString(this.value);
    }

    // backwards compatibility
    toBytes() {
        const SavWriter = require("../sav-writer");
        const savWriter = new SavWriter(this.getByteSize());
        this.write(savWriter);
        return savWriter.array;
    }
}

module.exports = StrProperty;
