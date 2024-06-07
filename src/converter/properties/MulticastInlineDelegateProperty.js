class MulticastInlineDelegateProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00]);
    type = "MulticastInlineDelegateProperty";

    constructor(name, savReader) {
        this.name = name;
        savReader.readUInt32(); // contentSize
        savReader.readBytes(5); // padding
        const number_of_elements = savReader.readUInt32();

        const tempMap = new Map();

        for (let i = 0; i < number_of_elements; i++) {
            const object_name = savReader.readString();
            const function_name = savReader.readString();
            tempMap.set(object_name, function_name);
        }

        this.elements = Array.from(tempMap.entries());
    }

    toBytes() {
        const {writeString, writeUint32} = require("../value-writer");

        let contentSize = 4
        for (const [object_name, function_name] of this.elements) {
            contentSize += 4 + object_name.length + 1;
            contentSize += 4 + function_name.length + 1;
        }

        let byteArrayContent = new Uint8Array(0);

        for (const [object_name, function_name] of this.elements) {
            byteArrayContent = new Uint8Array([...byteArrayContent, ...writeString(object_name), ...writeString(function_name)]);
        }

        return new Uint8Array([
            ...writeString(this.name),
            ...writeString(this.type),
            ...writeUint32(contentSize),
            ...MulticastInlineDelegateProperty.padding,
            ...writeUint32(this.elements.length),
            ...byteArrayContent
        ]);
    }
}

module.exports = MulticastInlineDelegateProperty;
