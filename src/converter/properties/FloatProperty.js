import {writeString, writeFloat32} from "../value-writer.js";

class FloatProperty {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    type = "FloatProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.skipBytes(FloatProperty.padding.length);
        this.value = savReader.readFloat32();
    }

    toBytes() {


        const nameBytes = writeString(this.name);
        const typeBytes = writeString(this.type);
        const paddingBytes = FloatProperty.padding;
        const valueBytes = writeFloat32(this.value);

        const totalLength =
            nameBytes.length +
            typeBytes.length +
            paddingBytes.length +
            valueBytes.length;

        const output = new Uint8Array(totalLength);

        let offset = 0;
        output.set(nameBytes, offset);
        offset += nameBytes.length;

        output.set(typeBytes, offset);
        offset += typeBytes.length;

        output.set(paddingBytes, offset);
        offset += paddingBytes.length;

        output.set(valueBytes, offset);

        return output;
    }
}

export default FloatProperty;
