import {
    HeaderProperty, NoneProperty, BoolProperty, IntProperty, UInt32Property, Int64Property, StrProperty,
    EnumProperty, FloatProperty, StructProperty, ArrayProperty, MulticastInlineDelegateProperty, MapProperty,
    SetProperty, ObjectProperty, ByteProperty, FileEndProperty, NameProperty
} from "./properties/index.js";

// https://stackoverflow.com/a/50868276
function arrayBufferToHexString(arrayBuffer) {
    return [...new Uint8Array(arrayBuffer)].reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}

class SavReader {

    constructor(fileArrayBuffer) {
        this.offset = 0;
        this.fileArrayBuffer = fileArrayBuffer;
        this.fileSize = fileArrayBuffer.byteLength;
        this.dataView = new DataView(fileArrayBuffer);
        this.propertyHistogram = {};
    }

    readWholeBuffer() {
        const output = [];

        // this.logProgress();

        const headerProperty = this.readHeader();
        // console.log(JSON.stringify(headerProperty, null, 2));
        output.push(headerProperty);
        // this.logProgress();

        while (!this.hasFinished()) {
            const nextProperty = this.readProperty();
            // console.log(JSON.stringify(nextProperty, null, 2));
            output.push(nextProperty);
            // this.logProgress();
            // console.log("next: ", this.offset);
        }

        const sortedHistogram = Object.entries(this.propertyHistogram)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, val]) => {
                acc[key] = val;
                return acc;
            }, {});
        console.table(sortedHistogram);

        return output;
    }

    hasFinished() {
        return this.offset === this.fileSize;
    }

    // logProgress() {
    //     console.log("Progress: " + Number((this.offset / this.fileSize) * 100).toFixed(2) + "%");
    // }

    readHeader() {
        return new HeaderProperty(this);
    }

    readProperty() {

        if (this.offset + FileEndProperty.bytes.length === this.fileSize) {
            const assumedFileEnd = new Uint8Array(this.fileArrayBuffer.slice(this.offset, this.offset + FileEndProperty.bytes.length));

            if (assumedFileEnd.every((value, index) => value === FileEndProperty.bytes[index])) {
                this.offset += FileEndProperty.bytes.length;
                this._incrementHistogram("FileEndProperty");
                return new FileEndProperty();
            }
        }

        const name = this.readString();

        if (name === "None") {
            this._incrementHistogram("NoneProperty");
            return new NoneProperty();
        }

        const type = this.readString();
        this._incrementHistogram(type);

        switch (type) {
            case "BoolProperty":
                return new BoolProperty(name, this);
            case "IntProperty":
                return new IntProperty(name, this);
            case "UInt32Property":
                return new UInt32Property(name, this);
            case "Int64Property":
                return new Int64Property(name, this);
            case "StrProperty":
                return new StrProperty(name, this);
            case "NameProperty":
                return new NameProperty(name, this);
            case "EnumProperty":
                return new EnumProperty(name, this);
            case "FloatProperty":
                return new FloatProperty(name, this);
            case "StructProperty":
                return new StructProperty(name, this);
            case "ArrayProperty":
                return new ArrayProperty(name, this);
            case "MulticastInlineDelegateProperty":
                return new MulticastInlineDelegateProperty(name, this);
            case "MapProperty":
                return new MapProperty(name, this);
            case "SetProperty":
                return new SetProperty(name, this);
            case "ObjectProperty":
                return new ObjectProperty(name, this);
            case "ByteProperty":
                return new ByteProperty(name, this);
            default:
                throw new Error("Unknown property type: " + type);
        }
    }

    _incrementHistogram(type) {
        if (!this.propertyHistogram[type]) {
            this.propertyHistogram[type] = 1;
        } else {
            this.propertyHistogram[type]++;
        }
    }

    readString() {
        const size = this.dataView.getUint32(this.offset, true);
        this.offset += 4;

        const string = new TextDecoder().decode(this.fileArrayBuffer.slice(this.offset, this.offset + size - 1));
        this.offset += size;

        // console.log("read string: ", string);
        return string;
    }

    readBoolean() {
        const boolean = Boolean(this.dataView.getUint8(this.offset));
        this.offset += 1;
        return boolean;
    }

    readFloat32() {
        const float = this.dataView.getFloat32(this.offset, true);
        this.offset += 4;
        return float;
    }

    readFloat64() {
        const float = this.dataView.getFloat64(this.offset, true);
        this.offset += 8;
        return float;
    }

    readByte() {
        const int = Number(this.dataView.getUint8(this.offset));
        this.offset += 1;
        return int;
    }

    readInt16() {
        const int = Number(this.dataView.getInt16(this.offset, true));
        this.offset += 2;
        return int;
    }

    readInt32() {
        const int = Number(this.dataView.getInt32(this.offset, true));
        this.offset += 4;
        return int;
    }

    readUInt32() {
        const int = Number(this.dataView.getUint32(this.offset, true));
        this.offset += 4;
        return int;
    }

    readInt64() {
        const int = this.dataView.getBigInt64(this.offset, true);
        this.offset += 8;
        return int;
    }

    readGuid() {
        const guidBytes = this.readBytes(16);

        const quarters = [
            guidBytes.slice(0, 8),
            guidBytes.slice(8, 16),
            guidBytes.slice(16, 24),
            guidBytes.slice(24, 32)
        ];

        const reversedQuarters = quarters.map(quarter => {
            return quarter.match(/.{2}/g).reverse().join('');
        });

        return reversedQuarters.join('').toUpperCase();
    }

    // currently, JS does not support Date objects as precise as ticks
    //
    // readDateTime() {
    //     const ticksBigInt = this.dataView.getBigInt64(this.offset, true);
    //     console.log(ticksBigInt);
    //     this.offset += 8;
    //     return new Date(Number(ticksBigInt / 10000n) + new Date("0001-01-01T00:00:00.000Z").getTime());
    // }

    readBytes(numberOfBytes) {
        const bytes = arrayBufferToHexString(this.fileArrayBuffer.slice(this.offset, this.offset + numberOfBytes));
        this.offset += numberOfBytes;
        return bytes;
    }

    skipBytes(numberOfBytes) {
        this.offset += numberOfBytes;
    }

}

export default SavReader;
