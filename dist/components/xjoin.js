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
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        const renders = this.children.map((v) => v.render(inheritedProps(attributes)));
        const result = new RichCharGrid();
        const height = attributes.height || Math.max(...renders.map((v) => v.height));
        if (renders.length === 0)
            return RichCharGrid.fill(attributes.width || 0, attributes.height || 0, fillChar);
        const contentsWidth = renders.reduce((c, v) => c + v.width, 0);
        // space-between: w / (n - 1)
        // space-around: w / n
        // space-evenly: w / (n + 1)
        let gapWidth;
        if (typeof attributes.gap === 'number') {
            gapWidth = attributes.gap;
        }
        else if (attributes.width != null) {
            const mappingTable = {
                'space-between': renders.length - 1,
                'space-around': renders.length,
                'space-evenly': renders.length + 1,
            };
            gapWidth = (attributes.width - contentsWidth) / mappingTable[attributes.gap];
        }
        else {
            gapWidth = 0;
        }
        let gapCumul = 0;
        for (let render of renders) {
            render.setHeight(height, alignInvrt[attributes.heightAlign], fillChar);
            if (render !== renders[0]) {
                console.log('AYO', render.toString(), renders);
                const gapConstituent = new RichCharGrid([]);
                const lastCumul = gapCumul;
                gapCumul += gapWidth;
                gapConstituent.setWidth(Math.round(gapCumul - lastCumul), 'end', fillChar);
                gapConstituent.setHeight(height, 'end', fillChar);
                result.mergeX(gapConstituent);
            }
            result.mergeX(render);
        }
        console.log(result.toString());
        if (attributes.width != null)
            result.setWidth(attributes.width, alignInvrt[attributes.widthAlign], fillChar);
        console.log(result.toString());
        return result;
    }
}
