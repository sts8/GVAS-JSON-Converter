class IntProperty {
    static SIZE_FOUR = [0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = 'IntProperty';
        savReader.skipBytes(8); // contains value size

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        this.value = savReader.readInt32();
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);
        savWriter.writeArray(IntProperty.SIZE_FOUR);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }

        savWriter.writeInt32(this.value);
    }
}

export default IntProperty;
