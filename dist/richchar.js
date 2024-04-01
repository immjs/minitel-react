export class RichChar {
    static normalizeAttributes(attributes) {
        return {
            fg: attributes.fg || 7,
            bg: attributes.bg || 0,
            underline: attributes.underline || false,
            sizeCode: attributes.sizeCode || 0,
            noBlink: attributes.noBlink || true,
            invert: attributes.invert || false,
        };
    }
    static getAttributesApplier(attributes) {
        const result = [];
        const offsets = {
            noBlink: 0x48,
            fg: 0x40,
            sizeCode: 0x4C,
            bg: 0x50,
            underline: 0x59,
            invert: 0x5C,
        };
        let attribute;
        for (attribute in attributes) {
            result.push(`\x1b${String.fromCharCode(Number(attributes[attribute])
                + offsets[attribute])}`);
        }
        return result.join('');
    }
    attributesDiff(attributes) {
        const result = {};
        let attribute;
        for (attribute in attributes) {
            if (attributes[attribute] !== this.attributes[attribute]) {
                // TYPESCRIPT TU SAOULES
                // @ts-ignore
                result[attribute] = this.attributes[attribute];
            }
        }
        return result;
    }
    constructor(char, attributes = {}) {
        this.char = char;
        this.attributes = RichChar.normalizeAttributes(attributes);
    }
    copy() {
        return new RichChar(this.char, this.attributes);
    }
}
