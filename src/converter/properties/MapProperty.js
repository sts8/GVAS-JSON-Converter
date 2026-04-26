import NoneProperty from "./NoneProperty.js";
import SavWriter from "../sav-writer.js";
import {assignPrototype} from "../converter.js";

class MapProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "MapProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.skipBytes(4); // padding
        this.keyType = savReader.readString();
        this.valueType = savReader.readString();
        savReader.skipBytes(1);

        const tempMap = new Map();
        savReader.skipBytes(4); // padding
        const contentCount = savReader.readUInt32();

        for (let i = 0; i < contentCount; i++) {

            let currentKey = null;
            let currentValue = null;

            switch (this.keyType) {
                case "StructProperty":
                    currentKey = savReader.readBytes(16);
                    break;

                case "IntProperty":
                    currentKey = savReader.readInt32();
                    break;

                case "StrProperty":
                    currentKey = savReader.readString();
                    break;

                default:
                    throw new Error("Key Type not implemented: " + this.keyType);
            }

            switch (this.valueType) {

                case "StructProperty":
                    currentValue = [];
                    let prop = null;

                    while (!(prop instanceof NoneProperty)) {
                        prop = savReader.readProperty();
                        currentValue.push(prop);
                    }
                    break;

                case "IntProperty":
                    currentValue = savReader.readInt32();
                    break;

                case "FloatProperty":
                    currentValue = savReader.readFloat32();
                    break;

                case "BoolProperty":
                    currentValue = savReader.readBoolean();
                    break;

                case "StrProperty":
                    currentValue = savReader.readString();
                    break;

                default:
                    throw new Error("Value Type not implemented: " + this.valueType);
            }

            tempMap.set(currentKey, currentValue);
        }

        this.value = Array.from(tempMap.entries());
    }

    write(writer) {
        const contentWriter = new SavWriter();
        const tempMap = new Map(this.value);

        for (const [currentKey, currentValue] of tempMap) {

            switch (this.keyType) {
                case "StructProperty":
                    contentWriter.writeHex(currentKey);
                    break;
                case "IntProperty":
                    contentWriter.writeInt32(currentKey);
                    break;
                case "StrProperty":
                    contentWriter.writeString(currentKey);
                    break;
                default:
                    throw new Error("Key Type not implemented: " + this.keyType);
            }

            switch (this.valueType) {
                case "StructProperty":
                    for (let i = 0; i < currentValue.length; i++) {
                        assignPrototype(currentValue[i]).write(contentWriter);
                    }
                    break;
                case "IntProperty":
                    contentWriter.writeInt32(currentValue);
                    break;
                case "FloatProperty":
                    contentWriter.writeFloat32(currentValue);
                    break;
                case "StrProperty":
                    contentWriter.writeString(currentValue);
                    break;
                case "BoolProperty":
                    contentWriter.writeByte(currentValue ? 0x01 : 0x00);
                    break;
                default:
                    throw new Error("Value Type not implemented: " + this.valueType);
            }
        }

        const content = contentWriter.result;
        writer.writeString(this.name);
        writer.writeString(this.type);
        writer.writeUInt32(4 + 4 + content.length);
        writer.writeArray(MapProperty.padding);
        writer.writeString(this.keyType);
        writer.writeString(this.valueType);
        writer.writeArray(MapProperty.padding);
        writer.writeByte(0x00);
        writer.writeUInt32(tempMap.size);
        writer.writeArray(content);
    }
}

export default MapProperty;
