import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';

export class YJoin extends MinitelObject {
    constructor(children: MinitelObject[] = [], attributes: Partial<MinitelObjectAttributes> = {}) {
        super(children, attributes);
    }
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>) {
        const attributes: MinitelObjectAttributes = {
            ...MinitelObject.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };
        const fillChar = new RichChar(attributes.fillChar, attributes);

        const renders = this.children.map((v) => v.render(inheritedProps(attributes)));

        const result = new RichCharGrid();

        const width = attributes.width || Math.max(...renders.map((v) => v.width));

        if (renders.length === 0) return RichCharGrid.fill(attributes.width || 0, attributes.height || 0, fillChar);
        
        for (let render of renders) {
            render.setWidth(width, alignInvrt[attributes.widthAlign], fillChar)
            result.mergeY(render);
        } 
        if (attributes.height != null) result.setHeight(attributes.height, alignInvrt[attributes.heightAlign], fillChar);
        return result;
    }
}
