const SavReader = require("../../../src/converter/sav-reader");
const UInt32Property = require("../../../src/converter/properties/UInt32Property");
const SavWriter = require("../../../src/converter/sav-writer");

test("UInt32Property", () => {
    const data = new Uint8Array([
        /* 19 */                    0x13, 0x00, 0x00, 0x00,
        /* "someUInt32Property" */  0x73, 0x6F, 0x6D, 0x65, 0x55, 0x49, 0x6E, 0x74, 0x33, 0x32, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 15 */                    0x0F, 0x00, 0x00, 0x00,
        /* "UInt32Property" */      0x55, 0x49, 0x6E, 0x74, 0x33, 0x32, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 */                     0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: False */       0x00,
        /* 789 */                   0x15, 0x03, 0x00, 0x00
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(UInt32Property);
    expect(property.name).toBe("someUInt32Property");
    expect(property.guid).toBeUndefined();
    expect(property.value).toBe(789);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});
