import {getStringByteSize} from '../sav-writer.js';

class StrProperty {
    static PADDING = [0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = 'StrProperty';
        savReader.skipBytes(8); // contains value size + padding

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        this.value = savReader.readString();
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
}

export default StrProperty;
