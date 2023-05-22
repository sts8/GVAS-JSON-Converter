const {SavReader} = require("../src/sav-reader");
const {BoolProperty, IntProperty, UInt32Property, StrProperty} = require("../src/properties");
const {
    someBoolPropertyBytes, someFalseBoolPropertyBytes, someIntPropertyBytes, someUInt32PropertyBytes,
    someStrPropertyBytes
} = require("./assets/example-property-bytes");

test("BoolProperty", () => {
    const someBoolProperty = new SavReader(someBoolPropertyBytes.buffer).readProperty();
    expect(someBoolProperty).toBeInstanceOf(BoolProperty);
    expect(someBoolProperty.name).toBe("someBoolProperty");
    expect(someBoolProperty.value).toBe(true);
    expect(someBoolProperty.toBytes()).toEqual(someBoolPropertyBytes);

    const someFalseBoolProperty = new SavReader(someFalseBoolPropertyBytes.buffer).readProperty();
    expect(someFalseBoolProperty).toBeInstanceOf(BoolProperty);
    expect(someFalseBoolProperty.name).toBe("someBoolProperty");
    expect(someFalseBoolProperty.value).toBe(false);
    expect(someFalseBoolProperty.toBytes()).toEqual(someFalseBoolPropertyBytes);
});

test("IntProperty", () => {
    const someIntProperty = new SavReader(someIntPropertyBytes.buffer).readProperty();
    expect(someIntProperty).toBeInstanceOf(IntProperty);
    expect(someIntProperty.name).toBe("someIntProperty");
    expect(someIntProperty.value).toBe(123);
    expect(someIntProperty.toBytes()).toEqual(someIntPropertyBytes);
});

test("UInt32Property", () => {
    const someUInt32Property = new SavReader(someUInt32PropertyBytes.buffer).readProperty();
    expect(someUInt32Property).toBeInstanceOf(UInt32Property);
    expect(someUInt32Property.name).toBe("someUInt32Property");
    expect(someUInt32Property.value).toBe(789);
    expect(someUInt32Property.toBytes()).toEqual(someUInt32PropertyBytes);
});

test("StrProperty", () => {
    const someStrProperty = new SavReader(someStrPropertyBytes.buffer).readProperty();
    expect(someStrProperty).toBeInstanceOf(StrProperty);
    expect(someStrProperty.name).toBe("someStrProperty");
    expect(someStrProperty.value).toBe("test-string");
    expect(someStrProperty.toBytes()).toEqual(someStrPropertyBytes);
});
