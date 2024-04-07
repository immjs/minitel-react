import { CharAttributes } from './types.js';

export class RichChar {
    attributes: CharAttributes;
    char: string;
    codependencies: Set<RichChar>;
    // skip: boolean;
    static normalizeAttributes(attributes: Partial<CharAttributes>): CharAttributes {
        return {
            fg: attributes.fg ?? 7,
            bg: attributes.bg ?? 0,
            underline: attributes.underline ?? false,
            doubleHeight: attributes.doubleHeight ?? false,
            doubleWidth: attributes.doubleWidth ?? false,
            noBlink: attributes.noBlink ?? true,
            invert: attributes.invert ?? false,
        };
    }
    static getAttributesApplier(attributes: Partial<CharAttributes>, previousAttributes: CharAttributes) {
        const result = [];
        const offsets: Record<keyof Omit<CharAttributes, 'doubleHeight' | 'doubleWidth'>, number> = {
            noBlink: 0x48,
            fg: 0x40,
            bg: 0x50,
            underline: 0x59,
            invert: 0x5C,
        };
        let attribute: keyof Omit<CharAttributes, 'doubleHeight' | 'doubleWidth'>;
        for (attribute in offsets) {
            if (attribute in attributes) {
                result.push(`\x1b${String.fromCharCode(
                    Number(attributes[attribute])
                    + offsets[attribute]
                )}`);
            }
        }
        if ('doubleHeight' in attributes || 'doubleWidth' in attributes) {
            const doubleWidth = attributes.doubleWidth ?? previousAttributes.doubleWidth;
            const doubleHeight = attributes.doubleHeight ?? previousAttributes.doubleHeight;
            // console.log('AYO!!');
            result.push(`\x1b${String.fromCharCode([[0x4c, 0x4d], [0x4e, 0x4f]][+doubleWidth][+doubleHeight])}`);
        }
        return result.join('');
    }
    attributesDiff(attributes: CharAttributes) {
        const result = {} as CharAttributes;
        let attribute: keyof CharAttributes;
        for (attribute in attributes) {
            if (attributes[attribute] !== this.attributes[attribute]) {
                // TYPESCRIPT TU SAOULES
                // @ts-ignore
                result[attribute] = this.attributes[attribute];
            }
        }
        return result;
    }
    constructor(char: string, attributes: Partial<CharAttributes> = {}, codeps?: RichChar[]) {
        // this.skip = skip;
        this.char = char;
        this.codependencies = new Set();
        if (codeps) codeps.forEach((char) => this.addCodep(char));
        // if (attributes.doubleWidth) console.log('aye')
        this.attributes = RichChar.normalizeAttributes(attributes);
    }
    copy() {
        return new RichChar(this.char, this.attributes, [...this.codependencies]);
    }
    addCodep(codep: RichChar) {
        codep.codependencies.add(this);
        this.codependencies.add(codep);
    }
    noSize() {
        const newAttributes = {
            ...this.attributes,
            doubleWidth: false,
            doubleHeight: false,
        };
        return new RichChar(this.char, newAttributes, [...this.codependencies]);
    }
}
