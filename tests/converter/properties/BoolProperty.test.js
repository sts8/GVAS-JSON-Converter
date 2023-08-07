const SavReader = require("../../../src/converter/sav-reader");
const BoolProperty = require("../../../src/converter/properties/BoolProperty");

test("BoolProperty - True", () => {

    const BoolPropertyTrueBytes = new Uint8Array([
        /* 17 */                 0x11, 0x00, 0x00, 0x00,
        /* "someBoolProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 13 */                 0x0D, 0x00, 0x00, 0x00,
        /* "BoolProperty" */     0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* <Padding> */          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* True */               0x01,
        /* <Padding> */          0x00
    ]);

    const someBoolProperty = new SavReader(BoolPropertyTrueBytes.buffer).readProperty();
    expect(someBoolProperty).toBeInstanceOf(BoolProperty);
    expect(someBoolProperty.name).toBe("someBoolProperty");
    expect(someBoolProperty.value).toBe(true);
    expect(someBoolProperty.toBytes()).toEqual(BoolPropertyTrueBytes);
});

test("BoolProperty - False", () => {

    const BoolPropertyFalseBytes = new Uint8Array([
        /* 17 */                 0x11, 0x00, 0x00, 0x00,
        /* "someBoolProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 13 */                 0x0D, 0x00, 0x00, 0x00,
        /* "BoolProperty" */     0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* <Padding> */          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* False */              0x00,
        /* <Padding> */          0x00
    ]);

    const someFalseBoolProperty = new SavReader(BoolPropertyFalseBytes.buffer).readProperty();
    expect(someFalseBoolProperty).toBeInstanceOf(BoolProperty);
    expect(someFalseBoolProperty.name).toBe("someBoolProperty");
    expect(someFalseBoolProperty.value).toBe(false);
    expect(someFalseBoolProperty.toBytes()).toEqual(BoolPropertyFalseBytes);
});
