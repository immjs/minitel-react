import { MinitelObject } from './minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes, RenderLinesAttributes } from '../types.js';
import wrap from 'word-wrap';
import { RichChar } from '../richchar.js';

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
        const xScalingFactor = attributes.doubleWidth ? 2 : 1;
        if (width != null) {
            const actualWidth = Math.floor(width / xScalingFactor);
            switch (attributes.wrap) {
                case 'word-break':
                    text = wrap(text, { width: actualWidth, cut: true });
                    break;
                case 'word-wrap':
                    text = wrap(text, { width: actualWidth });
                    break;
                case 'clip':
                    text = text.split('\n').map((v) => v.slice(0, actualWidth)).join('\n');
                    break;
            }
        }

        const result = new RichCharGrid();
        const lines = text.split(/\r?\n/g);
        const concreteWidth = Math.max(...lines.map((v) => v.length * xScalingFactor));
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        for (let line of lines) {
            result.mergeY(RichCharGrid.fromLine(line, attributes).setWidth(concreteWidth, attributes.textAlign, fillChar));
        }
        return result;
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
        const xScalingFactor = attributes.doubleWidth ? 2 : 1;
        if (width != null) {
            const actualWidth = Math.floor(width / xScalingFactor);
            switch (attributes.wrap) {
                case 'word-break':
                    text = wrap(text, { width: actualWidth, cut: true });
                    break;
                case 'word-wrap':
                    text = wrap(text, { width: actualWidth });
                    break;
                case 'clip':
                    text = text.split('\n').map((v) => v.slice(0, actualWidth)).join('\n');
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