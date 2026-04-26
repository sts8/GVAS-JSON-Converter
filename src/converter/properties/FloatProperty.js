class FloatProperty {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    type = 'FloatProperty';

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(FloatProperty.padding.length);
        this.value = savReader.readFloat32();
    }

    write(writer) {
        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeArray(FloatProperty.padding);
        writer.writeFloat32(this.value);
    }
}

export default FloatProperty;
