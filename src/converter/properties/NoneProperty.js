class NoneProperty {
    static bytes = new Uint8Array([0x05, 0x00, 0x00, 0x00, 0x4E, 0x6F, 0x6E, 0x65, 0x00]);
    type = "NoneProperty";

    toBytes() {
        return NoneProperty.bytes;
    }
}

module.exports = NoneProperty;
