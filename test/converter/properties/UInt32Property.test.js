import test from "node:test";
import assert from "node:assert/strict";

import SavReader from "../../../src/converter/sav-reader.js";
import UInt32Property from "../../../src/converter/properties/UInt32Property.js";
import SavWriter from "../../../src/converter/sav-writer.js";

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
    assert.ok(property instanceof UInt32Property, "should be UInt32Property");
    assert.strictEqual(property.name, "someUInt32Property");
    assert.strictEqual(property.guid, undefined);
    assert.strictEqual(property.value, 789);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});
