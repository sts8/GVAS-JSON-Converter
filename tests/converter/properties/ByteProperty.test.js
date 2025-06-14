const SavReader = require("../../../src/converter/sav-reader");
const ByteProperty = require("../../../src/converter/properties/ByteProperty");
const SavWriter = require("../../../src/converter/sav-writer");

test("ByteProperty", () => {
    const data = new Uint8Array([
        /* name length (24) */                 0x18, 0x00, 0x00, 0x00,
        /* name ("CharacterGameDifficulty") */ 0x43, 0x68, 0x61, 0x72, 0x61, 0x63, 0x74, 0x65, 0x72, 0x47, 0x61, 0x6D, 0x65, 0x44, 0x69, 0x66, 0x66, 0x69, 0x63, 0x75, 0x6C, 0x74, 0x79, 0x00,

        /* type length (13) */      0x0D, 0x00, 0x00, 0x00,
        /* type ("ByteProperty") */ 0x42, 0x79, 0x74, 0x65, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,

        /* ? */                     0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,

        /* subtype length (5) */    0x05, 0x00, 0x00, 0x00,
        /* subtype ("None") */      0x4E, 0x6F, 0x6E, 0x65, 0x00,

        /* has guid: False */       0x00,

        /* value */                 0x01
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(ByteProperty);
    expect(property.name).toBe("CharacterGameDifficulty");
    expect(property.subtype).toBe("None");
    expect(property.guid).toBeUndefined();
    expect(property.value).toBe(1);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});

test("byte-1 writer", () => {
    const data = new Uint8Array([
        /* 7 */              0x07, 0x00, 0x00, 0x00,
        /* "byte-1" */       0x62, 0x79, 0x74, 0x65, 0x2D, 0x31, 0x00,
        /* 13 */             0x0D, 0x00, 0x00, 0x00,
        /* "ByteProperty" */ 0x42, 0x79, 0x74, 0x65, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* ? */              0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* 5 */              0x05, 0x00, 0x00, 0x00,
        /* "None" */         0x4E, 0x6F, 0x6E, 0x65, 0x00,
        /* has guid: True */ 0x01,
        /* guid */           0x4B, 0x03, 0xCA, 0x58, 0x91, 0x4E, 0x24, 0x41, 0xA5, 0x5D, 0x4B, 0x2C, 0xD5, 0xB3, 0x18, 0x1E,
        /* 123 */            0x7B
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(ByteProperty);
    expect(property.name).toBe("byte-1");
    expect(property.guid).toBe("58CA034B41244E912C4B5DA51E18B3D5");
    expect(property.value).toBe(123);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});

test("byte-2", () => {
    const data = new Uint8Array([
        0x07, 0x00, 0x00, 0x00,
        0x62, 0x79, 0x74, 0x65, 0x2D, 0x32, 0x00, 0x0D, 0x00, 0x00, 0x00,
        0x42, 0x79, 0x74, 0x65, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x4E, 0x6F, 0x6E, 0x65, 0x00,
        0x01, 0x00, 0x82, 0x4C, 0xD6, 0x42, 0x96, 0x16, 0x47, 0x8D, 0x4A, 0x59,
        0xF3, 0x6B, 0x46, 0x80, 0x65, 0xFF
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(ByteProperty);
    expect(property.name).toBe("byte-2");
    expect(property.guid).toBe("D64C820047169642F3594A8D6580466B");
    expect(property.value).toBe(255);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});
