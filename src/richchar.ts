import { CharAttributes } from './types.js';

export class RichChar {
  attributes: CharAttributes;
  char: string;
  static normalizeAttributes(attributes: Partial<CharAttributes>): CharAttributes {
      return {
          fg: attributes.fg || 7,
          bg: attributes.bg || 0,
          underline: attributes.underline || false,
          sizeCode: attributes.sizeCode || 0,
          noBlink: attributes.noBlink || true,
          invert: attributes.invert || false,
      };
  }
  static getAttributesApplier(attributes: CharAttributes) {
      const result = [];
      const offsets: Record<keyof CharAttributes, number> = {
          noBlink: 0x48,
          fg: 0x40,
          sizeCode: 0x4C,
          bg: 0x50,
          underline: 0x59,
          invert: 0x5C,
      };
      let attribute: keyof CharAttributes;
      for (attribute in attributes) {
          result.push(`\x1b${String.fromCharCode(
            Number(attributes[attribute])
            + offsets[attribute]
          )}`)
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
  constructor(char: string, attributes: Partial<CharAttributes> = {}) {
      this.char = char;
      this.attributes = RichChar.normalizeAttributes(attributes);
  }
  copy() {
      return new RichChar(this.char, this.attributes);
  }
}
