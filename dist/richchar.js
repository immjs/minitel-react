export class RichChar {
    // skip: boolean;
    static getDelimited(attributes) {
        return {
            bg: attributes.bg,
            underline: attributes.underline,
        };
    }
    static normalizeAttributes(attributes) {
        var _a, _b, _c, _d, _e, _f, _g;
        return {
            fg: (_a = attributes.fg) !== null && _a !== void 0 ? _a : 7,
            bg: (_b = attributes.bg) !== null && _b !== void 0 ? _b : 0,
            underline: (_c = attributes.underline) !== null && _c !== void 0 ? _c : false,
            doubleHeight: (_d = attributes.doubleHeight) !== null && _d !== void 0 ? _d : false,
            doubleWidth: (_e = attributes.doubleWidth) !== null && _e !== void 0 ? _e : false,
            noBlink: (_f = attributes.noBlink) !== null && _f !== void 0 ? _f : true,
            invert: (_g = attributes.invert) !== null && _g !== void 0 ? _g : false,
        };
    }
    static getAttributesApplier(attributes, previousAttributes) {
        var _a, _b;
        const result = [];
        const offsets = {
            noBlink: 0x48,
            fg: 0x40,
            bg: 0x50,
            underline: 0x59,
            invert: 0x5C,
        };
        let attribute;
        for (attribute in offsets) {
            if (attribute in attributes) {
                result.push(`\x1b${String.fromCharCode(Number(attributes[attribute])
                    + offsets[attribute])}`);
            }
        }
        if ('doubleHeight' in attributes || 'doubleWidth' in attributes) {
            const doubleWidth = (_a = attributes.doubleWidth) !== null && _a !== void 0 ? _a : previousAttributes.doubleWidth;
            const doubleHeight = (_b = attributes.doubleHeight) !== null && _b !== void 0 ? _b : previousAttributes.doubleHeight;
            result.push(`\x1b${String.fromCharCode([[0x4c, 0x4d], [0x4e, 0x4f]][+doubleWidth][+doubleHeight])}`);
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
    constructor(char, attributes = {}, ...[delta, actualChar,]) {
        this.char = char;
        this.delta = delta;
        this.actualChar = actualChar;
        this.attributes = RichChar.normalizeAttributes(attributes);
    }
    isEqual(that) {
        return this.char === that.char
            && Object.keys(RichChar.normalizeAttributes(this.attributes))
                .every((attribute) => that.attributes[attribute] === this.attributes[attribute])
            && (this.char === null
                ? (this.delta[0] == that.delta[0] && this.delta[1] == that.delta[1])
                // && this.actualChar!.isEqual(that.actualChar!)
                : true);
    }
    copy() {
        // typescript shall go down to hell
        return new RichChar(this.char, this.attributes, ...[this.delta, this.actualChar]);
    }
    noSize() {
        const newAttributes = Object.assign(Object.assign({}, this.attributes), { doubleWidth: false, doubleHeight: false });
        return new RichChar(this.char, newAttributes, ...[this.delta, this.actualChar]);
    }
}
