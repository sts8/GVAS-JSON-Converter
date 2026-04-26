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

    write(writer) {
        writer.writeArray(HeaderProperty.GVAS);
        writer.writeInt32(this.saveGameVersion);
        writer.writeInt32(this.packageVersion);
        if (typeof this.ue5 !== "undefined") writer.writeInt32(this.ue5);

        const [major, minor, patch] = this.engineVersion.split(".");
        writer.writeInt16(major);
        writer.writeInt16(minor);
        writer.writeInt16(patch);
        writer.writeUInt32(this.engineBuild);
        writer.writeString(this.engineBranch);
        writer.writeInt32(this.customVersionFormat);
        writer.writeInt32(this.customVersions.length);

        for (const [key, value] of this.customVersions) {
            writer.writeHex(key);
            writer.writeInt32(value);
        }

        writer.writeString(this.saveGameClassName);
    }
}

export default HeaderProperty;
