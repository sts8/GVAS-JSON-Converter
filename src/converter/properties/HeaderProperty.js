import {writeInt32, writeInt16, writeUint32, writeString, writeBytes} from "../value-writer.js";

class HeaderProperty {
    static GVAS = new Uint8Array([0x47, 0x56, 0x41, 0x53]);
    type = "HeaderProperty";

    constructor(savReader) {
        savReader.skipBytes(HeaderProperty.GVAS.length);
        this.saveGameVersion = savReader.readInt32();
        this.packageVersion = savReader.readInt32();

        if (this.saveGameVersion >= 3) {
            this.ue5 = savReader.readInt32();
        }

        this.engineVersion = savReader.readInt16() + "." + savReader.readInt16() + "." + savReader.readInt16();
        this.engineBuild = savReader.readUInt32();
        this.engineBranch = savReader.readString();

        this.customVersionFormat = savReader.readInt32();
        const numberOfCustomVersions = savReader.readInt32();
        const tempMap = new Map();

        for (let i = 0; i < numberOfCustomVersions; i++) {
            tempMap.set(savReader.readBytes(16), savReader.readInt32());
        }

        this.customVersions = Array.from(tempMap.entries());
        this.saveGameClassName = savReader.readString();
    }

    toBytes() {


        let resultArray = new Uint8Array([
            ...HeaderProperty.GVAS,
            ...writeInt32(this.saveGameVersion),
            ...writeInt32(this.packageVersion),
            ...(typeof this.ue5 !== 'undefined' ? writeInt32(this.ue5) : []),
            ...writeInt16(this.engineVersion.split(".")[0]),
            ...writeInt16(this.engineVersion.split(".")[1]),
            ...writeInt16(this.engineVersion.split(".")[2]),
            ...writeUint32(this.engineBuild),
            ...writeString(this.engineBranch),
            ...writeInt32(this.customVersionFormat),
            ...writeInt32(this.customVersions.length)
        ]);

        for (let i = 0; i < this.customVersions.length; i++) {
            resultArray = new Uint8Array([...resultArray,
                ...writeBytes(this.customVersions[i][0]),
                ...writeInt32(this.customVersions[i][1])
            ]);
        }

        resultArray = new Uint8Array([...resultArray, ...writeString(this.saveGameClassName)]);
        return resultArray;
    }
}

export default HeaderProperty;
