import { CharAttributes } from './types.js';
export declare class RichChar {
    attributes: CharAttributes;
    char: string;
    static normalizeAttributes(attributes: Partial<CharAttributes>): CharAttributes;
    static getAttributesApplier(attributes: CharAttributes): string;
    attributesDiff(attributes: CharAttributes): CharAttributes;
    constructor(char: string, attributes?: Partial<CharAttributes>);
    copy(): RichChar;
}
