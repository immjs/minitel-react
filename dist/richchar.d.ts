import { CharAttributes } from './types.js';
export declare class RichChar {
    attributes: CharAttributes;
    char: string;
    codependencies: Set<RichChar>;
    static getDelimited(attributes: CharAttributes): Pick<CharAttributes, 'bg' | 'underline'>;
    static normalizeAttributes(attributes: Partial<CharAttributes>): CharAttributes;
    static getAttributesApplier(attributes: Partial<CharAttributes>, previousAttributes: CharAttributes): string;
    attributesDiff(attributes: CharAttributes): CharAttributes;
    constructor(char: string, attributes?: Partial<CharAttributes>, codeps?: RichChar[]);
    isEqual(that: RichChar): boolean;
    copy(): RichChar;
    addCodep(codep: RichChar): void;
    noSize(): RichChar;
}
