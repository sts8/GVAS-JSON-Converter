import {test} from 'node:test';
import assert from 'node:assert/strict';

import SavReader from '../../../src/converter/sav-reader.js';
import {Int64Property} from '../../../src/converter/properties/index.js';
import SavWriter from '../../../src/converter/sav-writer.js';

test('Int64Property - int64-1', () => {
    const data = new Uint8Array([
        /* 8 */                    0x08, 0x00, 0x00, 0x00,
        /* "int64-1" */            0x69, 0x6E, 0x74, 0x36, 0x34, 0x2D, 0x31, 0x00,
        /* 15 */                   0x0E, 0x00, 0x00, 0x00,
        /* "Int64Property" */      0x49, 0x6E, 0x74, 0x36, 0x34, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 8 */                    0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: True */       0x01,
        /* guid */                 0xAD, 0x06, 0x12, 0xA9, 0x7B, 0xA8, 0x97, 0x41, 0xBF, 0x1D, 0x7B, 0x20, 0x6A, 0xEC, 0xB0, 0x0B,
        /* 9223372036854775807 */  0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x7F,
    ]);

    const property = new SavReader(data.buffer).readProperty();
    assert(property instanceof Int64Property);
    assert.strictEqual(property.name, 'int64-1');
    assert.strictEqual(property.guid, 'A91206AD4197A87B207B1DBF0BB0EC6A');
    assert.strictEqual(property.value, 9223372036854775807n);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});

test('Int64Property - int64-2', () => {
    const data = new Uint8Array([
        /* 8 */                    0x08, 0x00, 0x00, 0x00,
        /* "int64-2" */            0x69, 0x6E, 0x74, 0x36, 0x34, 0x2D, 0x32, 0x00,
        /* 15 */                   0x0E, 0x00, 0x00, 0x00,
        /* "Int64Property" */      0x49, 0x6E, 0x74, 0x36, 0x34, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 8 */                    0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* has guid: True */       0x01,
        /* guid */                 0x7A, 0xE1, 0x52, 0xE8, 0xE1, 0x68, 0xE5, 0x42, 0x93, 0xED, 0xE4, 0x74, 0x6D, 0x42, 0xD6, 0x0B,
        /* -5 */                   0xFB, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF
    ]);

    const property = new SavReader(data.buffer).readProperty();
    assert(property instanceof Int64Property);
    assert.strictEqual(property.name, 'int64-2');
    assert.strictEqual(property.guid, 'E852E17A42E568E174E4ED930BD6426D');
    assert.strictEqual(property.value, -5n);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});
