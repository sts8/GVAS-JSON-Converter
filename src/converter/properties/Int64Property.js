import {getStringByteSize} from "../sav-writer.js";

class Int64Property {
    static SIZE_EIGHT = [0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = "Int64Property";
        savReader.skipBytes(8); // contains value size

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        this.value = savReader.readInt64();
    }

    getByteSize() {
        return getStringByteSize(this.name) + 35 + (this.hasGuid ? 16 : 0);
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);
        savWriter.writeArray(Int64Property.SIZE_EIGHT);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }

        savWriter.writeInt64(this.value);
    }

    // backwards compatibility
    toBytes() {
        const SavWriter = require("../sav-writer");
        const savWriter = new SavWriter(this.getByteSize());
        this.write(savWriter);
        return savWriter.array;
    }
}

export default Int64Property;
