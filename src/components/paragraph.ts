import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';
import { TextNode } from '../abstract/textnode.js';
import type { Minitel } from './minitel.js';

export class Paragraph extends MinitelObject {
    children: TextNode[];
    constructor(children: TextNode[], attributes: Partial<MinitelObjectAttributes>, minitel: Minitel) {
        super([], attributes, minitel);

        this.children = [];
        for (let child of children) {
            this.appendChild(child);
        }
    }
    render(attributes: MinitelObjectAttributes, inheritMe: Partial<MinitelObjectAttributes>) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        const lines = [new RichCharGrid([[]])];
        for (let child of this.children) {
            const render = child.renderLines(inheritMe, {
                width: attributes.width,
                forcedIndent: lines.at(-1)!.width,
            });
            const newMaxIdx = lines.length - 1;
            for (let lineIdx in render) {
                if (+lineIdx !== 0) {
                    lines[newMaxIdx + +lineIdx] = new RichCharGrid([[]]);
                }
                lines[newMaxIdx + +lineIdx].mergeX(render[+lineIdx], 'end');
            }
        }

        const width = attributes.width || Math.max(...lines.map((v) => v.width));
        const result = new RichCharGrid([]);

        for (let line of lines) {
            line.setWidth(width, alignInvrt[attributes.textAlign], fillChar);
            result.mergeY(line);
        }
        if (attributes.height) {
            result.setHeight(attributes.height, 'end', fillChar);
        }
        return result;
    }
}