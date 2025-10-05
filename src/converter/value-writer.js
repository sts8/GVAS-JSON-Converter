export function writeInt16(value) {
    const array = new Uint8Array(2);
    new DataView(array.buffer).setInt16(0, value, true);
    return array;
}

export function writeInt32(value) {
    const array = new Uint8Array(4);
    new DataView(array.buffer).setInt32(0, value, true);
    return array;
}

export function writeUint32(value) {
    const array = new Uint8Array(4);
    new DataView(array.buffer).setUint32(0, value, true);
    return array;
}

export function writeInt64(value) {
    const array = new Uint8Array(8);
    new DataView(array.buffer).setBigInt64(0, value, true);
    return array;
}

export function writeFloat32(value) {
    const array = new Uint8Array(4);
    new DataView(array.buffer).setFloat32(0, value, true);
    return array;
}

export function writeFloat64(value) {
    const array = new Uint8Array(8);
    new DataView(array.buffer).setFloat64(0, value, true);
    return array;
}

export function writeString(string) {
    if (string === "") {
        const array = new Uint8Array(4);
        new DataView(array.buffer).setUint32(0, 0, true);
        return array;
    }

    const stringSize = writeUint32(string.length + 1);
    const stringArray = new TextEncoder().encode(string);

    return new Uint8Array([...stringSize, ...stringArray, 0x00]);
}

// currently, JS does not support Date objects as precise as ticks
//
// export function writeDateTime(dateTimeString) {
//     const date = new Date(dateTimeString);
//     const array = new Uint8Array(8);
//     const ticks = (BigInt(date.getTime()) * 10000n) + 621355968000000000n;
//     new DataView(array.buffer).setBigInt64(0, ticks, true);
//     return array;
// }

// https://stackoverflow.com/a/50868276
export function writeBytes(hexString) {
    return Uint8Array.from(hexString.match(/../g).map((byte) => parseInt(byte, 16)));
}
