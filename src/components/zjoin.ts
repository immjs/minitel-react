import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';
import type { Minitel } from './minitel.js';

export class ZJoin extends MinitelObject<ZJoinAttributes> {
    static defaultAttributes: ZJoinAttributes = {
        ...MinitelObject.defaultAttributes,
        widthAlign: 'start',
        heightAlign: 'start',
        inheritTransparency: false,
    };
    defaultAttributes = ZJoin.defaultAttributes;
    constructor(children: MinitelObject[], attributes: Partial<ZJoinAttributes>, minitel: Minitel) {
        super(children, attributes, minitel);
    }
    render(attributes: ZJoinAttributes, inheritMe: Partial<ZJoinAttributes>) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        const transparentFillChar = new RichChar('\x09', attributes).noSize();

        if (this.children.length === 0) return new RichCharGrid();

        const renders = this.children.map((v) => v.renderWrapper(inheritMe, {
            width: attributes.width,
            height: attributes.height,
            ...(attributes.inheritTransparency ? { fillChar: '\x09' } : {}),
        }));

        const maxWidth = Math.max(...renders.map((v) => v.width));
        const maxHeight = Math.max(...renders.map((v) => v.height));

        const result = RichCharGrid.fill(maxWidth, maxHeight, fillChar);

        for (const render of renders) {
            render.setWidth(maxWidth, attributes.widthAlign, transparentFillChar);
            render.setHeight(maxHeight, attributes.heightAlign, transparentFillChar);
            for (const lineIdx in render.grid) {
                for (const colIdx in render.grid[lineIdx]) {
                    const char = render.grid[lineIdx][colIdx];
                    if (char.char !== '\x09') {
                        result.grid[lineIdx][colIdx] = char;
                    }
                }
            }
            result.mergeLocationDescriptors(render);
        }

        return result;
    }
}

export interface ZJoinAttributes extends MinitelObjectAttributes {
    widthAlign: Align;
    heightAlign: Align;
    inheritTransparency: boolean;
}
