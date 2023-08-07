// const {writeString, writeBytes} = require("../value-writer");
//
// class ByteProperty {
//     type = "ByteProperty";
//
//     constructor(name, savReader) {
//         this.name = name;
//         // this.unknown = savReader.readBytes(1); // maybe isEnum?
//         // const contentSize = savReader.readUInt32();
//         this.value = savReader.readBytes(8);
//         console.log(this.value);
//     }
//
//     toBytes() {
//         return new Uint8Array([
//             ...writeString(this.name),
//             ...writeString(this.type),
//             ...writeBytes(this.value)
//         ]);
//     }
// }
//
// module.exports = ByteProperty;
