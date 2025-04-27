const NoneProperty = require("./NoneProperty");

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

    toBytes() {
        const {writeBytes, writeInt32, writeFloat32, writeString, writeUint32} = require("../value-writer");
        const {assignPrototype} = require("../converter");

        let byteArrayContent = new Uint8Array(0);

        const tempMap = new Map(this.value);

        for (let [currentKey, currentValue] of tempMap) {

            switch (this.keyType) {
                case "StructProperty":
                    byteArrayContent = new Uint8Array([...byteArrayContent, ...writeBytes(currentKey)]);
                    break;

                case "IntProperty":
                    byteArrayContent = new Uint8Array([...byteArrayContent, ...writeInt32(currentKey)]);
                    break;

                case "StrProperty":
                    byteArrayContent = new Uint8Array([...byteArrayContent, ...writeString(currentKey)]);
                    break;

                default:
                    throw new Error("Key Type not implemented: " + this.keyType);
            }

            switch (this.valueType) {

                case "StructProperty":
                    for (let i = 0; i < currentValue.length; i++) {
                        assignPrototype(currentValue[i]);
                        byteArrayContent = new Uint8Array([...byteArrayContent, ...currentValue[i].toBytes()]);
                    }
                    break;

                case "IntProperty":
                    byteArrayContent = new Uint8Array([...byteArrayContent, ...writeInt32(currentValue)]);
                    break;

                case "FloatProperty":
                    byteArrayContent = new Uint8Array([...byteArrayContent, ...writeFloat32(currentValue)]);
                    break;

                case "StrProperty":
                    byteArrayContent = new Uint8Array([...byteArrayContent, ...writeString(currentValue)]);
                    break;

                case "BoolProperty":
                    if (currentValue === true) {
                        byteArrayContent = new Uint8Array([...byteArrayContent, 0x01]);
                    } else {
                        byteArrayContent = new Uint8Array([...byteArrayContent, 0x00]);
                    }
                    break;

                default:
                    throw new Error("Value Type not implemented: " + this.valueType);
            }

        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(4 + 4 + byteArrayContent.length),
            ...MapProperty.padding,
            ...writeString(this.keyType),
            ...writeString(this.valueType),
            ...MapProperty.padding,
            0x00,
            ...writeUint32(tempMap.size),
            ...byteArrayContent
        ]);
    }
}

module.exports = MapProperty;
