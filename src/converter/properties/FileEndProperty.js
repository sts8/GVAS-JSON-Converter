const NoneProperty = require("./NoneProperty");

class FileEndProperty {
    static bytes = new Uint8Array([...NoneProperty.bytes, 0x00, 0x00, 0x00, 0x00]);
    type = "FileEndProperty";

    toBytes() {
        return FileEndProperty.bytes;
    }
}

module.exports = FileEndProperty;
