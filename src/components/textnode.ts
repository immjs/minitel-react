import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes, RenderLinesAttributes } from '../types.js';
import wrap from 'word-wrap';

export class TextNode extends MinitelObject {
    text: string;
    constructor(text: string, attributes: Partial<MinitelObjectAttributes> = {}) {
        super([], attributes);
        this.text = text;
    }
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes: Partial<MinitelObjectAttributes>) {
        const attributes: MinitelObjectAttributes = {
            ...MinitelObject.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };

        let text = this.text;
        const width = attributes.width;
        if (width != null) {
            switch (attributes.wrap) {
                case 'word-break':
                    text = wrap(text, { width, cut: true });
                    break;
                case 'word-wrap':
                    text = wrap(text, { width });
                    break;
                case 'clip':
                    text = text.split('\n').map((v) => v.slice(0, width)).join('\n');
                    break;
            }
        }
        return RichCharGrid.from(text, attributes);
    }
    renderLines(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes: Partial<RenderLinesAttributes>) {
        const attributes = {
            ...MinitelObject.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };

        let text = ' '.repeat(attributes.forcedIndent || 0) + this.text;
        const width = attributes.width;
        if (width != null) {
            switch (attributes.wrap) {
                case 'word-break':
                    text = wrap(text, { width, cut: true });
                    break;
                case 'word-wrap':
                    text = wrap(text, { width });
                    break;
                case 'clip':
                    text = text.split('\n').map((v) => v.slice(0, width)).join('\n');
                    break;
            }
        }
        text = text.slice(attributes.forcedIndent);
        const result = [];
        const lines = text.split(/\r?\n/g);
        for (let line of lines) {
            result.push(RichCharGrid.fromLine(line, attributes));
        }
        return result;
    }
}