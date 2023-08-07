const SavReader = require("../../../src/converter/sav-reader");
const ByteProperty = require("../../../src/converter/properties/ByteProperty");

test("ByteProperty", () => {

    const BytePropertyBytes = new Uint8Array([
        /* name length (24) */                 0x18, 0x00, 0x00, 0x00,
        /* name ("CharacterGameDifficulty") */ 0x43, 0x68, 0x61, 0x72, 0x61, 0x63, 0x74, 0x65, 0x72, 0x47, 0x61, 0x6D, 0x65, 0x44, 0x69, 0x66, 0x66, 0x69, 0x63, 0x75, 0x6C, 0x74, 0x79, 0x00,

        /* type length (13) */      0x0D, 0x00, 0x00, 0x00,
        /* type ("ByteProperty") */ 0x42, 0x79, 0x74, 0x65, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,

        /* content length (1) */    0x01, 0x00, 0x00, 0x00,

        /* padding */               0x00, 0x00, 0x00, 0x00,

        /* subtype length (5) */    0x05, 0x00, 0x00, 0x00,
        /* subtype ("None") */      0x4E, 0x6F, 0x6E, 0x65, 0x00,

        /* content start marker */  0x00,

        /* value */                 0x01
    ]);

    const someByteProperty = new SavReader(BytePropertyBytes.buffer).readProperty();
    expect(someByteProperty).toBeInstanceOf(ByteProperty);
    expect(someByteProperty.name).toBe("CharacterGameDifficulty");
    expect(someByteProperty.subtype).toBe("None");
    expect(someByteProperty.value).toBe("01");
    expect(someByteProperty.toBytes()).toEqual(BytePropertyBytes);
});
