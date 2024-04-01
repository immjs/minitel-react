import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { alignInvrt, inheritedProps } from '../utils.js';
export class XJoin extends MinitelObject {
    constructor(children = [], attributes = {}) {
        super(children, attributes);
    }
    render(inheritedAttributes, forcedAttributes) {
        const attributes = Object.assign(Object.assign(Object.assign(Object.assign({}, MinitelObject.defaultAttributes), inheritedAttributes), this.attributes), forcedAttributes);
        const fillChar = new RichChar(attributes.fillChar, attributes);
        const renders = this.children.map((v) => v.render(inheritedProps(attributes)));
        const result = new RichCharGrid();
        const height = attributes.height || Math.max(...renders.map((v) => v.height));
        if (renders.length === 0)
            return RichCharGrid.fill(attributes.width || 0, attributes.height || 0, fillChar);
        for (let render of renders) {
            render.setHeight(height, alignInvrt[attributes.heightAlign], fillChar);
            result.mergeX(render);
        }
        if (attributes.width != null)
            result.setWidth(attributes.width, alignInvrt[attributes.widthAlign], fillChar);
        return result;
    }
}
