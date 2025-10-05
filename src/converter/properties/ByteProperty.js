import {getStringByteSize} from "../sav-writer.js";

class ByteProperty {
    static SIZE_ONE = [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = "ByteProperty";
        savReader.skipBytes(8); // contains UNKNOWN

        this.subtype = savReader.readString();

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        this.value = savReader.readByte();
    }

    getByteSize() {
        return getStringByteSize(this.name) +
            getStringByteSize(this.subtype) + 27 +
            (this.hasGuid ? 16 : 0);
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);
        savWriter.writeArray(ByteProperty.SIZE_ONE);
        savWriter.writeString(this.subtype);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }

        savWriter.writeByte(this.value);
    }

    // backwards compatibility
    toBytes() {
        const SavWriter = require("../sav-writer");
        const savWriter = new SavWriter(this.getByteSize());
        this.write(savWriter);
        return savWriter.array;
    }
}

export default ByteProperty;
