import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
export class ZJoin extends MinitelObject {
    constructor(children, attributes, minitel) {
        super(children, attributes, minitel);
        this.defaultAttributes = ZJoin.defaultAttributes;
    }
    render(attributes, inheritMe) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        const transparentFillChar = new RichChar('\x09', attributes).noSize();
        if (this.children.length === 0)
            return new RichCharGrid();
        const renders = this.children.map((v) => v.renderWrapper(inheritMe, Object.assign({ width: attributes.width, height: attributes.height }, (attributes.inheritTransparency ? { fillChar: '\x09' } : {}))));
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
ZJoin.defaultAttributes = Object.assign(Object.assign({}, MinitelObject.defaultAttributes), { widthAlign: 'start', heightAlign: 'start', inheritTransparency: false });
