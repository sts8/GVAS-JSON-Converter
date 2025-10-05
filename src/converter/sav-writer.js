export default class SavWriter {

    constructor(totalByteSize) {
        this.offset = 0;
        this.totalByteSize = totalByteSize;
        this.array = new Uint8Array(totalByteSize);
        this.dataView = new DataView(this.array.buffer);
    }

    writeString(string) {
        if (string === "") {
            this.dataView.setUint32(this.offset, 0, true);
            this.offset += 4;
        } else {
            this.dataView.setUint32(this.offset, string.length + 1, true);
            this.offset += 4;
            const stringArray = new TextEncoder().encode(string);
            this.array.set(stringArray, this.offset);
            this.offset += string.length;
            this.array[this.offset++] = 0x00;
        }
    }

    writeArray(array) {
        this.array.set(array, this.offset);
        this.offset += array.length;
    }

    writeByte(byte) {
        this.array[this.offset++] = byte;
    }

    writeBoolean(bool) {
        this.array[this.offset++] = bool ? 0x01 : 0x00;
    }

    writeInt32(value) {
        this.dataView.setInt32(this.offset, value, true);
        this.offset += 4;
    }

    writeUInt32(value) {
        this.dataView.setUint32(this.offset, value, true);
        this.offset += 4;
    }

    writeInt64(value) {
        this.dataView.setBigInt64(this.offset, value, true);
        this.offset += 8;
    }

    writeGuid(string) {
        const quarters = [
            string.slice(0, 8),
            string.slice(8, 16),
            string.slice(16, 24),
            string.slice(24, 32)
        ];

        const reversedQuarters = quarters.map(quarter => {
            return quarter.match(/.{2}/g).reverse().join('');
        });

        const hexString = reversedQuarters.join('').toUpperCase();
        this.writeArray(hexString.match(/../g).map((byte) => parseInt(byte, 16)));
    }

    // currently, JS does not support Date objects as precise as ticks
//
// function writeDateTime(dateTimeString) {
//     const date = new Date(dateTimeString);
//     const array = new Uint8Array(8);
//     const ticks = (BigInt(date.getTime()) * 10000n) + 621355968000000000n;
//
//     new DataView(array.buffer).setBigInt64(0, ticks, true);
//
//     return array;
// }

    // // https://stackoverflow.com/a/50868276
    // function writeBytes(hexString) {
    //     return Uint8Array.from(hexString.match(/../g).map((byte) => parseInt(byte, 16)));
    // }

}

export function getStringByteSize(string) {
    if (string === "") {
        return 4;
    }

    return 5 + string.length;
}
