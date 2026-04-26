export default class SavWriter {

    constructor(initialCapacity = 512 * 1024) {
        this.offset = 0;
        this.array = new Uint8Array(initialCapacity);
        this.dataView = new DataView(this.array.buffer);
    }

    #ensure(bytes) {
        if (this.offset + bytes <= this.array.length) return;
        const next = new Uint8Array(Math.max(this.array.length * 2, this.offset + bytes));
        next.set(this.array);
        this.array = next;
        this.dataView = new DataView(next.buffer);
    }

    get result() {
        return this.array.subarray(0, this.offset);
    }

    writeString(string) {
        if (string === '') {
            this.#ensure(4);
            this.dataView.setUint32(this.offset, 0, true);
            this.offset += 4;
        } else {
            const encoded = new TextEncoder().encode(string);
            this.#ensure(5 + encoded.length);
            this.dataView.setUint32(this.offset, encoded.length + 1, true);
            this.offset += 4;
            this.array.set(encoded, this.offset);
            this.offset += encoded.length;
            this.array[this.offset++] = 0x00;
        }
    }

    writeArray(array) {
        this.#ensure(array.length);
        this.array.set(array, this.offset);
        this.offset += array.length;
    }

    writeByte(byte) {
        this.#ensure(1);
        this.array[this.offset++] = byte;
    }

    writeBoolean(bool) {
        this.#ensure(1);
        this.array[this.offset++] = bool ? 0x01 : 0x00;
    }

    writeInt16(value) {
        this.#ensure(2);
        this.dataView.setInt16(this.offset, value, true);
        this.offset += 2;
    }

    writeInt32(value) {
        this.#ensure(4);
        this.dataView.setInt32(this.offset, value, true);
        this.offset += 4;
    }

    writeUInt32(value) {
        this.#ensure(4);
        this.dataView.setUint32(this.offset, value, true);
        this.offset += 4;
    }

    writeInt64(value) {
        this.#ensure(8);
        this.dataView.setBigInt64(this.offset, value, true);
        this.offset += 8;
    }

    writeFloat32(value) {
        this.#ensure(4);
        this.dataView.setFloat32(this.offset, value, true);
        this.offset += 4;
    }

    writeFloat64(value) {
        this.#ensure(8);
        this.dataView.setFloat64(this.offset, value, true);
        this.offset += 8;
    }

    // https://stackoverflow.com/a/50868276
    writeHex(hexString) {
        const pairs = hexString.match(/../g);
        this.#ensure(pairs.length);
        for (let i = 0; i < pairs.length; i++) {
            this.array[this.offset++] = parseInt(pairs[i], 16);
        }
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
        this.writeHex(hexString);
    }

}

export function getStringByteSize(string) {
    if (string === '') {
        return 4;
    }

    return 5 + string.length;
}
