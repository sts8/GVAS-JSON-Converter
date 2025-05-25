const {getStringByteSize} = require("../sav-writer");

class MulticastInlineDelegateProperty {
    static PADDING = [0x00, 0x00, 0x00, 0x00];

    constructor(name, savReader) {
        this.name = name;
        this.type = "MulticastInlineDelegateProperty";
        savReader.skipBytes(8); // contains content size + padding

        this.hasGuid = savReader.readBoolean();
        if (this.hasGuid) {
            this.guid = savReader.readGuid();
        }

        const numberOfElements = savReader.readUInt32();

        this.elements = Array.from({length: numberOfElements},
            () => [
                savReader.readString(),
                savReader.readString()
            ]);
    }

    getByteSize() {
        const byteSize = getStringByteSize(this.name) + 45 + (this.hasGuid ? 16 : 0);


        return byteSize + this._getContentSize();
    }

    _getContentSize() {
        let contentSize = 4; // padding
        for (const [objectName, functionName] of this.elements) {
            contentSize += getStringByteSize(objectName) + getStringByteSize(functionName);
        }
        return contentSize;
    }

    write(savWriter) {
        savWriter.writeString(this.name);
        savWriter.writeString(this.type);
        savWriter.writeUInt32(this._getContentSize());
        savWriter.writeArray(MulticastInlineDelegateProperty.PADDING);

        savWriter.writeBoolean(this.hasGuid);
        if (this.hasGuid) {
            savWriter.writeGuid(this.guid);
        }

        savWriter.writeUInt32(this.elements.length);

        for (const [objectName, functionName] of this.elements) {
            savWriter.writeString(objectName);
            savWriter.writeString(functionName);
        }
    }

    // backwards compatibility
    toBytes() {
        const SavWriter = require("../sav-writer");
        const savWriter = new SavWriter(this.getByteSize());
        this.write(savWriter);
        return savWriter.array;
    }
}

module.exports = MulticastInlineDelegateProperty;
