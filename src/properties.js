const {
    writeInt32,
    writeUint32,
    writeString,
    writeFloat32,
    writeBytes,
    writeDateTime,
    writeInt16
} = require("./sav-writer");

function assignPrototype(rawProperty) {
    switch (rawProperty.type) {
        case "HeaderProperty":
            return Object.setPrototypeOf(rawProperty, HeaderProperty.prototype);
        case "NoneProperty":
            return Object.setPrototypeOf(rawProperty, NoneProperty.prototype);
        case "BoolProperty":
            return Object.setPrototypeOf(rawProperty, BoolProperty.prototype);
        case "IntProperty":
            return Object.setPrototypeOf(rawProperty, IntProperty.prototype);
        case "UInt32Property":
            return Object.setPrototypeOf(rawProperty, UInt32Property.prototype);
        case "StrProperty":
            return Object.setPrototypeOf(rawProperty, StrProperty.prototype);
        case "EnumProperty":
            return Object.setPrototypeOf(rawProperty, EnumProperty.prototype);
        case "FloatProperty":
            return Object.setPrototypeOf(rawProperty, FloatProperty.prototype);
        case "StructProperty":
            return Object.setPrototypeOf(rawProperty, StructProperty.prototype);
        case "ArrayProperty":
            return Object.setPrototypeOf(rawProperty, ArrayProperty.prototype);
        case "MulticastInlineDelegateProperty":
            return Object.setPrototypeOf(rawProperty, MulticastInlineDelegateProperty.prototype);
        case "MapProperty":
            return Object.setPrototypeOf(rawProperty, MapProperty.prototype);
        case "SetProperty":
            return Object.setPrototypeOf(rawProperty, SetProperty.prototype);
        case "ObjectProperty":
            return Object.setPrototypeOf(rawProperty, ObjectProperty.prototype);
        case "FileEndProperty":
            return Object.setPrototypeOf(rawProperty, FileEndProperty.prototype);
        default:
            throw new Error("Unknown property type: " + rawProperty.type);
    }
}

class HeaderProperty {
    static GVAS = new Uint8Array([0x47, 0x56, 0x41, 0x53]);
    type = "HeaderProperty";

    constructor(savReader) {
        savReader.readBytes(HeaderProperty.GVAS.length);
        this.saveGameVersion = savReader.readInt32();
        this.packageVersion = savReader.readInt32();

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

class NoneProperty {
    static bytes = new Uint8Array([0x05, 0x00, 0x00, 0x00, 0x4E, 0x6F, 0x6E, 0x65, 0x00]);
    type = "NoneProperty";

    toBytes() {
        return NoneProperty.bytes;
    }
}

class FileEndProperty {
    static bytes = new Uint8Array([...NoneProperty.bytes, 0x00, 0x00, 0x00, 0x00]);
    type = "FileEndProperty";

    toBytes() {
        return FileEndProperty.bytes;
    }
}

class BoolProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "BoolProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(BoolProperty.padding.length);
        this.value = savReader.readBoolean();
        savReader.readBytes(1);
    }

    toBytes() {
        let result = new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...BoolProperty.padding
        ]);

        if (this.value === true) {
            result = new Uint8Array([...result, 0x01]);
        } else {
            result = new Uint8Array([...result, 0x00]);
        }

        return new Uint8Array([...result, 0x00]);
    }
}

class IntProperty {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "IntProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(IntProperty.padding.length);
        this.value = savReader.readInt32();
    }

    toBytes() {
        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...IntProperty.padding,
            ...writeInt32(this.value)
        ]);
    }
}

class UInt32Property {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "UInt32Property";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(UInt32Property.padding.length);
        this.value = savReader.readUInt32();
    }

    toBytes() {
        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...UInt32Property.padding,
            ...writeUint32(this.value)
        ]);
    }
}

class StrProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "StrProperty";

    constructor(name, savReader) {
        this.name = name;
        this.unknown = savReader.readBytes(1);
        savReader.readBytes(StrProperty.padding.length);
        this.value = savReader.readString();
    }

    toBytes() {
        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeBytes(this.unknown),
            ...StrProperty.padding,
            ...writeString(this.value)
        ]);
    }
}

class EnumProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "EnumProperty";

    constructor(name, savReader) {
        this.name = name;
        this.type = "EnumProperty";
        savReader.readUInt32(); // contentSize
        savReader.readBytes(EnumProperty.padding.length);
        this.enum = savReader.readString();
        savReader.readBytes(1);
        this.value = savReader.readString();
    }

    toBytes() {

        const contentSize = 4 + this.value.length + 1;

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...EnumProperty.padding,
            ...writeString(this.enum),
            0x00,
            ...writeString(this.value)
        ]);
    }
}

class FloatProperty {
    static padding = new Uint8Array([
        0x04, // ?
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ]);
    type = "FloatProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readBytes(FloatProperty.padding.length);
        this.value = savReader.readFloat32();
    }

    toBytes() {
        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...FloatProperty.padding,
            ...writeFloat32(this.value)
        ]);
    }
}

class StructProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    static unknown = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "StructProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.readBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.readBytes(17); // unknown

        const contentEndPosition = savReader.offset + contentSize;

        if (this.subtype === "Guid") {
            this.value = savReader.readBytes(16);
            return this;
        }

        if (this.subtype === "DateTime") {
            this.value = savReader.readDateTime();
            return this;
        }

        this.value = [];

        while (savReader.offset < contentEndPosition) {
            this.value.push(savReader.readProperty());
        }
    }

    toBytes() {
        if (this.subtype === "Guid") {
            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(16),
                ...StructProperty.padding,
                ...writeString("Guid"),
                ...StructProperty.unknown,
                ...writeBytes(this.value)
            ]);
        }

        if (this.subtype === "DateTime") {
            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(8),
                ...StructProperty.padding,
                ...writeString("DateTime"),
                ...StructProperty.unknown,
                ...writeDateTime(this.value)
            ]);
        }

        let contentBytes = new Uint8Array(0);

        for (let i = 0; i < this.value.length; i++) {

            if (Array.isArray(this.value[i])) {

                for (let j = 0; j < this.value[i].length; j++) {
                    assignPrototype(this.value[i][j]);
                    contentBytes = new Uint8Array([...contentBytes, ...this.value[i][j].toBytes()]);
                }

            } else {
                assignPrototype(this.value[i]);
                contentBytes = new Uint8Array([...contentBytes, ...this.value[i].toBytes()]);
            }
        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentBytes.length),
            ...StructProperty.padding,
            ...writeString(this.subtype),
            ...StructProperty.unknown,
            ...contentBytes
        ]);
    }
}

class ArrayProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    static unknown = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "ArrayProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.readBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.readBytes(1);

        switch (this.subtype) {
            case "StructProperty":
                const contentCount = savReader.readUInt32();

                const nameAgain = savReader.readString();
                if (nameAgain !== this.name) throw new Error();

                const subtypeAgain = savReader.readString();
                if (subtypeAgain !== this.subtype) throw new Error();

                savReader.readUInt32(); // arraySize
                savReader.readBytes(4); // padding

                this.genericType = savReader.readString();

                const unknown = savReader.readBytes(17);
                if (unknown !== "0000000000000000000000000000000000") throw new Error();

                this.value = [];

                switch (this.genericType) {
                    case "Guid":
                        for (let i = 0; i < contentCount; i++) {
                            this.value.push(savReader.readBytes(16));
                        }
                        break;

                    default:

                        for (let i = 0; i < contentCount; i++) {
                            const structElementInstance = [];

                            let structElementInstanceChildProperty = null;

                            while (!(structElementInstanceChildProperty instanceof NoneProperty)) {
                                structElementInstanceChildProperty = savReader.readProperty();
                                structElementInstance.push(structElementInstanceChildProperty);

                            }

                            this.value.push(structElementInstance);
                        }
                }

                break;

            default:
                this.value = savReader.readBytes(contentSize);
        }
    }

    toBytes() {
        const contentCount = this.value.length;
        let byteArrayContent = new Uint8Array(0);

        let contentSize;

        switch (this.subtype) {
            case "StructProperty":

                switch (this.genericType) {
                    case "Guid":
                        for (let i = 0; i < contentCount; i++) {
                            byteArrayContent = new Uint8Array([...byteArrayContent, ...writeBytes(this.value[i])]);
                        }
                        break;

                    default:
                        for (let i = 0; i < contentCount; i++) {

                            if (Array.isArray(this.value[i])) {
                                for (let j = 0; j < this.value[i].length; j++) {
                                    assignPrototype(this.value[i][j]);
                                    byteArrayContent = new Uint8Array([...byteArrayContent, ...this.value[i][j].toBytes()]);
                                }
                            } else {
                                assignPrototype(this.value[i]);
                                byteArrayContent = new Uint8Array([...byteArrayContent, ...this.value[i].toBytes()]);
                            }
                        }
                }

                contentSize =
                    4
                    + 4 + this.name.length + 1
                    + 4 + this.subtype.length + 1
                    + 4
                    + ArrayProperty.padding.length
                    + 4 + this.genericType.length + 1
                    + ArrayProperty.unknown.length
                    + byteArrayContent.length;

                return new Uint8Array([
                    ...writeString(this.name),
                    ...writeString(this.type),
                    ...writeUint32(contentSize),
                    ...ArrayProperty.padding,
                    ...writeString(this.subtype),
                    0x00, // --- contentSize content below ---
                    ...writeUint32(contentCount),
                    ...writeString(this.name),
                    ...writeString(this.subtype),
                    ...writeUint32(byteArrayContent.length),
                    ...ArrayProperty.padding,
                    ...writeString(this.genericType),
                    ...ArrayProperty.unknown,
                    ...byteArrayContent
                ]);

            default:
                contentSize = this.value.length / 2;
                return new Uint8Array([
                    ...writeString(this.name),
                    ...writeString(this.type),
                    ...writeUint32(contentSize),
                    ...ArrayProperty.padding,
                    ...writeString(this.subtype),
                    0x00, // --- contentSize content below ---
                    ...writeBytes(this.value)
                ]);
        }
    }
}

class MulticastInlineDelegateProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    static unknown = new Uint8Array([0x01, 0x00, 0x00, 0x00]);
    type = "MulticastInlineDelegateProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.readBytes(5); // padding
        savReader.readBytes(4); // unknown
        this.object_name = savReader.readString();
        this.function_name = savReader.readString();
    }

    toBytes() {
        const contentSize =
            MulticastInlineDelegateProperty.unknown.length
            + 4 + this.object_name.length + 1
            + 4 + this.function_name.length + 1;

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...MulticastInlineDelegateProperty.padding,
            ...MulticastInlineDelegateProperty.unknown,
            ...writeString(this.object_name),
            ...writeString(this.function_name)
        ]);
    }
}

class MapProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "MapProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.readBytes(4); // padding
        this.keyType = savReader.readString();
        this.valueType = savReader.readString();
        savReader.readBytes(1);

        const tempMap = new Map();
        savReader.readBytes(4); // padding
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

                default:
                    throw new Error("Value Type not implemented: " + this.valueType);
            }

            tempMap.set(currentKey, currentValue);

        }

        this.value = Array.from(tempMap.entries());
    }

    toBytes() {

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

class SetProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = "SetProperty";

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.readBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.readBytes(1);

        if (this.subtype === "StructProperty") {

            savReader.readBytes(4); // padding

            const contentCount = savReader.readUInt32();
            this.value = [];
            for (let i = 0; i < contentCount; i++) {
                this.value.push(savReader.readBytes(16));
            }
            return this;
        }

        this.value = savReader.readBytes(contentSize);
    }

    toBytes() {
        if (this.subtype === "StructProperty") {

            const contentCount = this.value.length;
            let byteArrayContent = new Uint8Array(0);

            for (let i = 0; i < contentCount; i++) {
                byteArrayContent = new Uint8Array([...byteArrayContent, ...writeBytes(this.value[i])]);
            }

            return new Uint8Array([
                ...writeString(this.name),
                ...writeString(this.type),
                ...writeUint32(4 + 4 + byteArrayContent.length),
                ...SetProperty.padding,
                ...writeString(this.subtype),
                0x00,
                ...SetProperty.padding,
                ...writeUint32(contentCount),
                ...byteArrayContent
            ]);
        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(this.value.length / 2),
            ...SetProperty.padding,
            ...writeString(this.subtype),
            0x00,
            ...writeBytes(this.value)
        ]);
    }
}

class ObjectProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "ObjectProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.readBytes(5); // padding
        this.value = savReader.readString();
    }

    toBytes() {
        const contentSize = 4 + this.value.length + 1;

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...ObjectProperty.padding,
            ...writeString(this.value)
        ]);
    }
}

module.exports = {
    assignPrototype,

    UInt32Property,
    StrProperty,
    EnumProperty,
    SetProperty,
    StructProperty,
    ObjectProperty,
    HeaderProperty,
    NoneProperty,
    FloatProperty,
    FileEndProperty,
    BoolProperty,
    IntProperty,
    MapProperty,
    MulticastInlineDelegateProperty,
    ArrayProperty
};
