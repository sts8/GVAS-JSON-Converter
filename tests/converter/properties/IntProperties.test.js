const SavReader = require("../../../src/converter/sav-reader");
const IntProperty = require("../../../src/converter/properties/IntProperty");
const Int64Property = require("../../../src/converter/properties/Int64Property");
const UInt32Property = require("../../../src/converter/properties/UInt32Property");

test("IntProperty", () => {

    const IntPropertyBytes = new Uint8Array([
        /* 16 */                0x10, 0x00, 0x00, 0x00,
        /* "someIntProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "IntProperty" */     0x49, 0x6E, 0x74, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 -> 32bit value */  0x04,
        /* <Padding> */         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* 123 */               0x7B, 0x00, 0x00, 0x00
    ]);

    const someIntProperty = new SavReader(IntPropertyBytes.buffer).readProperty();
    expect(someIntProperty).toBeInstanceOf(IntProperty);
    expect(someIntProperty.name).toBe("someIntProperty");
    expect(someIntProperty.value).toBe(123);
    expect(someIntProperty.toBytes()).toEqual(IntPropertyBytes);
});

test("UInt32Property", () => {

    const UInt32PropertyBytes = new Uint8Array([
        /* 19 */                   0x13, 0x00, 0x00, 0x00,
        /* "someUInt32Property" */ 0x73, 0x6F, 0x6D, 0x65, 0x55, 0x49, 0x6E, 0x74, 0x33, 0x32, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 15 */                   0x0F, 0x00, 0x00, 0x00,
        /* "UInt32Property" */     0x55, 0x49, 0x6E, 0x74, 0x33, 0x32, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 4 -> 32bit value */     0x04,
        /* <Padding> */            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* 789 */                  0x15, 0x03, 0x00, 0x00
    ]);

    const someUInt32Property = new SavReader(UInt32PropertyBytes.buffer).readProperty();
    expect(someUInt32Property).toBeInstanceOf(UInt32Property);
    expect(someUInt32Property.name).toBe("someUInt32Property");
    expect(someUInt32Property.value).toBe(789);
    expect(someUInt32Property.toBytes()).toEqual(UInt32PropertyBytes);
});

test("Int64Property", () => {

    const Int64PropertyBytes = new Uint8Array([
        /* 12 */               0x0C, 0x00, 0x00, 0x00,
        /* "SessionTime" */    0x53, 0x65, 0x73, 0x73, 0x69, 0x6F, 0x6E, 0x54, 0x69, 0x6D, 0x65, 0x00,
        /* 14 */               0x0E, 0x00, 0x00, 0x00,
        /* "Int64Property" */  0x49, 0x6E, 0x74, 0x36, 0x34, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 8 -> 64bit value */ 0x08,
        /* <Padding> */        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* 189556562872 */     0xB8, 0x9B, 0x73, 0x22, 0x2C, 0x00, 0x00, 0x00
    ]);

    const someInt64Property = new SavReader(Int64PropertyBytes.buffer).readProperty();
    expect(someInt64Property).toBeInstanceOf(Int64Property);
    expect(someInt64Property.name).toBe("SessionTime");
    expect(someInt64Property.value).toBe(189556562872);
    expect(someInt64Property.toBytes()).toEqual(Int64PropertyBytes);
});
