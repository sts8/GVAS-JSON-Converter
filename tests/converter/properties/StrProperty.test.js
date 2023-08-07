const SavReader = require("../../../src/converter/sav-reader");
const StrProperty = require("../../../src/converter/properties/StrProperty");

test("StrProperty", () => {

    const StrPropertyBytes = new Uint8Array([
        /* 16 */                0x10, 0x00, 0x00, 0x00,
        /* "someStrProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x53, 0x74, 0x72, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "StrProperty" */     0x53, 0x74, 0x72, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* unknown */           0x04,
        /* <Padding> */         0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* 12 */                0x0C, 0x00, 0x00, 0x00,
        /* "test-string" */     0x74, 0x65, 0x73, 0x74, 0x2D, 0x73, 0x74, 0x72, 0x69, 0x6E, 0x67, 0x00
    ]);

    const someStrProperty = new SavReader(StrPropertyBytes.buffer).readProperty();
    expect(someStrProperty).toBeInstanceOf(StrProperty);
    expect(someStrProperty.name).toBe("someStrProperty");
    expect(someStrProperty.value).toBe("test-string");
    expect(someStrProperty.toBytes()).toEqual(StrPropertyBytes);
});
