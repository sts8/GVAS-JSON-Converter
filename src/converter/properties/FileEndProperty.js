import NoneProperty from "./NoneProperty.js";

class FileEndProperty {
    static bytes = new Uint8Array([...NoneProperty.bytes, 0x00, 0x00, 0x00, 0x00]);
    type = "FileEndProperty";

    toBytes() {
        return FileEndProperty.bytes;
    }
}

export default FileEndProperty;
