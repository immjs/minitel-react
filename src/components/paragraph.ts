import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';
import { TextNode } from './textnode.js';

export class Paragraph extends MinitelObject {
    children: TextNode[];
    constructor(children: TextNode[], attributes?: Partial<MinitelObjectAttributes>) {
        super([], attributes);

        this.children = [];
        for (let child of children) {
            this.appendChild(child);
        }
    }
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>) {
        const attributes = {
            ...MinitelObject.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };
        const fillChar = new RichChar(attributes.fillChar, attributes);
        const lines = [new RichCharGrid([[]])];
        for (let child of this.children) {
            const render = child.renderLines(inheritedProps(attributes), {
                width: attributes.width,
                forcedIndent: lines.at(-1)!.width,
            });
            const prevMaxIdx = lines.length - 1;
            for (let lineIdx in render) {
                if (+lineIdx > 0) lines[prevMaxIdx + +lineIdx] = new RichCharGrid([[]]);
                lines[prevMaxIdx + +lineIdx].mergeX(render[+lineIdx], 'end');
            }
        }
        
        const width = attributes.width || Math.max(...lines.map((v) => v.width));
        const result = new RichCharGrid([]);

        for (let line of lines) {
            line.setWidth(width, alignInvrt[attributes.widthAlign], fillChar);
            result.mergeY(line);
        }
        if (attributes.height) {
            result.setHeight(attributes.height, alignInvrt[attributes.heightAlign], fillChar);
        }
        return result;
    }
}