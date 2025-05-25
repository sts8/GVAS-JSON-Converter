const SavReader = require("../../../src/converter/sav-reader");
const IntProperty = require("../../../src/converter/properties/IntProperty");
const SavWriter = require("../../../src/converter/sav-writer");

test("IntProperty int-1 (with GUID)", () => {
    const data = new Uint8Array([
        /* 6 */                 0x06, 0x00, 0x00, 0x00,
        /* "int-1" */           0x69, 0x6E, 0x74, 0x2D, 0x31, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "IntProperty" */     0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 */                 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: True */    0x01,
        /* guid */              0x32, 0xC7, 0xF8, 0x97, 0x72, 0x64, 0xDB, 0x46, 0x8D, 0x61, 0xB8, 0x20, 0xD6, 0x8E, 0xFF, 0x6A,
        /* 123 */               0x7B, 0x00, 0x00, 0x00
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(IntProperty);
    expect(property.name).toBe("int-1");
    expect(property.guid).toBe("97F8C73246DB647220B8618D6AFF8ED6");
    expect(property.value).toBe(123);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});

test("IntProperty int-2 (with GUID)", () => {
    const data = new Uint8Array([
        /* 6 */                 0x06, 0x00, 0x00, 0x00,
        /* "int-2" */           0x69, 0x6E, 0x74, 0x2D, 0x32, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "IntProperty" */     0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 */                 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: True */    0x01,
        /* guid */              0x16, 0xF3, 0x63, 0xC3, 0x3E, 0xFD, 0xE6, 0x47, 0xBE, 0x12, 0x07, 0x9E, 0x15, 0xAB, 0xEA, 0x6C,
        /* -321 */              0xBF, 0xFE, 0xFF, 0xFF
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(IntProperty);
    expect(property.name).toBe("int-2");
    expect(property.guid).toBe("C363F31647E6FD3E9E0712BE6CEAAB15");
    expect(property.value).toBe(-321);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});

test("IntProperty (with GUID)", () => {
    const data = new Uint8Array([
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "asd-integer" */     0x61, 0x73, 0x64, 0x2D, 0x69, 0x6E, 0x74, 0x65, 0x67, 0x65, 0x72, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "IntProperty" */     0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 */                 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: True */    0x01,
        /* guid */              0x18, 0xA0, 0x37, 0x38, 0x46, 0x73, 0x90, 0x4F, 0x85, 0xDA, 0x82, 0x15, 0x6F, 0x63, 0x63, 0x93,
        /* 333 */               0x4D, 0x01, 0x00, 0x00
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(IntProperty);
    expect(property.name).toBe("asd-integer");
    expect(property.guid).toBe("3837A0184F9073461582DA859363636F");
    expect(property.value).toBe(333);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});

test("IntProperty (no GUID)", () => {
    const data = new Uint8Array([
        /* 16 */                0x10, 0x00, 0x00, 0x00,
        /* "someIntProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "IntProperty" */     0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 */                 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: False */   0x00,
        /* 123 */               0x7B, 0x00, 0x00, 0x00
    ]);

    const property = new SavReader(data.buffer).readProperty();
    expect(property).toBeInstanceOf(IntProperty);
    expect(property.name).toBe("someIntProperty");
    expect(property.guid).toBeUndefined();
    expect(property.value).toBe(123);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    expect(writer.array).toEqual(data);
});
