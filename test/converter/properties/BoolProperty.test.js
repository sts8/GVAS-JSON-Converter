import {test} from 'node:test';
import assert from 'node:assert/strict';

import SavReader from '../../../src/converter/sav-reader.js';
import BoolProperty from '../../../src/converter/properties/BoolProperty.js';
import SavWriter from '../../../src/converter/sav-writer.js';

test('BoolProperty - True (no GUID)', () => {
    const data = new Uint8Array([
        /* 17 */                 0x11, 0x00, 0x00, 0x00,
        /* "someBoolProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 13 */                 0x0D, 0x00, 0x00, 0x00,
        /* "BoolProperty" */     0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* <Padding> */          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* value: True */        0x01,
        /* has guid: False */    0x00
    ]);

    const property = new SavReader(data.buffer).readProperty();
    assert(property instanceof BoolProperty);
    assert.strictEqual(property.name, 'someBoolProperty');
    assert.strictEqual(property.value, true);
    assert.strictEqual(property.guid, undefined);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});

test('BoolProperty - False (no GUID)', () => {
    const data = new Uint8Array([
        /* 17 */                 0x11, 0x00, 0x00, 0x00,
        /* "someBoolProperty" */ 0x73, 0x6F, 0x6D, 0x65, 0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* 13 */                 0x0D, 0x00, 0x00, 0x00,
        /* "BoolProperty" */     0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* <Padding> */          0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* value: False */       0x00,
        /* has guid: False */    0x00
    ]);

    const property = new SavReader(data.buffer).readProperty();
    assert(property instanceof BoolProperty);
    assert.strictEqual(property.name, 'someBoolProperty');
    assert.strictEqual(property.value, false);
    assert.strictEqual(property.guid, undefined);

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});

test('BoolProperty - True (with GUID)', () => {
    const data = new Uint8Array([
        /* 7 */               0x07, 0x00, 0x00, 0x00,
        /* "bool-1" */        0x62, 0x6F, 0x6F, 0x6C, 0x2D, 0x31, 0x00,
        /* 13 */              0x0D, 0x00, 0x00, 0x00,
        /* "BoolProperty" */  0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* <Padding> */       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* value: True */     0x01,
        /* has guid: True */  0x01,
        /* guid */            0x77, 0x9F, 0x70, 0xDF, 0xA6, 0x05, 0x0B, 0x46, 0x8F, 0x65, 0xB4, 0xF4, 0x03, 0x22, 0xD3, 0xCF
    ]);

    const property = new SavReader(data.buffer).readProperty();
    assert(property instanceof BoolProperty);
    assert.strictEqual(property.name, 'bool-1');
    assert.strictEqual(property.value, true);
    assert.strictEqual(property.guid, 'DF709F77460B05A6F4B4658FCFD32203');

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});

test('BoolProperty - False (with GUID)', () => {
    const data = new Uint8Array([
        /* 7 */               0x07, 0x00, 0x00, 0x00,
        /* "bool-2" */        0x62, 0x6F, 0x6F, 0x6C, 0x2D, 0x32, 0x00,
        /* 13 */              0x0D, 0x00, 0x00, 0x00,
        /* "BoolProperty" */  0x42, 0x6F, 0x6F, 0x6C, 0x50, 0x72, 0x6F, 0x70, 0x65, 0x72, 0x74, 0x79, 0x00,
        /* <Padding> */       0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        /* value: False */    0x00,
        /* has guid: True */  0x01,
        /* guid */            0xC7, 0xE0, 0x13, 0x48, 0xDD, 0x20, 0xF1, 0x48, 0xB9, 0x07, 0xAD, 0xC0, 0x05, 0xE0, 0x37, 0x15
    ]);

    const property = new SavReader(data.buffer).readProperty();
    assert(property instanceof BoolProperty);
    assert.strictEqual(property.name, 'bool-2');
    assert.strictEqual(property.value, false);
    assert.strictEqual(property.guid, '4813E0C748F120DDC0AD07B91537E005');

    const writer = new SavWriter(property.getByteSize());
    property.write(writer);

    assert.deepStrictEqual(writer.array, data);
});
