import NoneProperty from './NoneProperty.js';
import SavWriter from '../sav-writer.js';
import {assignPrototype} from '../converter.js';

class ArrayProperty {
    static padding = new Uint8Array([0x00, 0x00, 0x00, 0x00]);
    type = 'ArrayProperty';

    constructor(name, savReader) {
        this.name = name;
        const contentSize = savReader.readUInt32();
        savReader.skipBytes(4); // padding
        this.subtype = savReader.readString();
        savReader.skipBytes(1);

        switch (this.subtype) {
            case 'StructProperty':
                const contentCount = savReader.readUInt32();

                const nameAgain = savReader.readString();
                if (nameAgain !== this.name) throw new Error();

                const subtypeAgain = savReader.readString();
                if (subtypeAgain !== this.subtype) throw new Error();

                savReader.readUInt32(); // arraySize
                savReader.skipBytes(4); // padding

                this.genericType = savReader.readString();

                this.guid = savReader.readBytes(16);
                savReader.skipBytes(1);

                this.value = [];

                switch (this.genericType) {
                    case 'Guid':
                        for (let i = 0; i < contentCount; i++) {
                            this.value.push(savReader.readBytes(16));
                        }
                        break;

                    default:
                        for (let i = 0; i < contentCount; i++) {
                            const structElementInstance = [];
                            let structElementInstanceChildProperty = null;

                            while (!(structElementInstanceChildProperty instanceof NoneProperty)) {
                                structElementInstanceChildProperty = savReader.readProperty();
                                structElementInstance.push(structElementInstanceChildProperty);
                            }

                            this.value.push(structElementInstance);
                        }
                }

                break;

            case 'NameProperty':
                const numberOfArrayElements = savReader.readUInt32();
                this.value = [];

                for (let i = 0; i < numberOfArrayElements; i++) {
                    this.value.push(savReader.readString());
                }

                break;

            default:
                this.value = savReader.readBytes(contentSize);
        }
    }

    write(writer) {
        const contentCount = this.value.length;

        switch (this.subtype) {
            case 'StructProperty': {
                const contentWriter = new SavWriter();

                switch (this.genericType) {
                    case 'Guid':
                        for (let i = 0; i < contentCount; i++) {
                            contentWriter.writeHex(this.value[i]);
                        }
                        break;

                    default:
                        for (let i = 0; i < contentCount; i++) {
                            if (Array.isArray(this.value[i])) {
                                for (let j = 0; j < this.value[i].length; j++) {
                                    assignPrototype(this.value[i][j]).write(contentWriter);
                                }
                            } else {
                                assignPrototype(this.value[i]).write(contentWriter);
                            }
                        }
                }

                const content = contentWriter.result;
                const contentSize =
                    4
                    + 4 + this.name.length + 1
                    + 4 + this.subtype.length + 1
                    + 4
                    + ArrayProperty.padding.length
                    + 4 + this.genericType.length + 1
                    + 16 + 1
                    + content.length;

                writer.writeString(this.name);
                writer.writeString(this.type);
                writer.writeUInt32(contentSize);
                writer.writeArray(ArrayProperty.padding);
                writer.writeString(this.subtype);
                writer.writeByte(0x00);
                writer.writeUInt32(contentCount);
                writer.writeString(this.name);
                writer.writeString(this.subtype);
                writer.writeUInt32(content.length);
                writer.writeArray(ArrayProperty.padding);
                writer.writeString(this.genericType);
                writer.writeHex(this.guid + '00');
                writer.writeArray(content);
                break;
            }

            case 'NameProperty': {
                const contentWriter = new SavWriter();
                let contentSize = 4;
                for (let i = 0; i < contentCount; i++) {
                    contentWriter.writeString(this.value[i]);
                    contentSize += 4 + this.value[i].length + 1;
                }

                writer.writeString(this.name);
                writer.writeString(this.type);
                writer.writeUInt32(contentSize);
                writer.writeArray(ArrayProperty.padding);
                writer.writeString(this.subtype);
                writer.writeByte(0x00);
                writer.writeUInt32(contentCount);
                writer.writeArray(contentWriter.result);
                break;
            }

            default: {
                const contentSize = this.value.length / 2;
                writer.writeString(this.name);
                writer.writeString(this.type);
                writer.writeUInt32(contentSize);
                writer.writeArray(ArrayProperty.padding);
                writer.writeString(this.subtype);
                writer.writeByte(0x00);
                writer.writeHex(this.value);
            }
        }
    }
}

export default ArrayProperty;
