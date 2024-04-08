import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';

export class YJoin extends MinitelObject {
    static defaultAttributes: YJoinAttributes = {
        ...MinitelObject.defaultAttributes,
        gap: 0,
        widthAlign: 'stretch',
        heightAlign: 'start',
    }
    constructor(children: MinitelObject[] = [], attributes: Partial<MinitelObjectAttributes> = {}) {
        super(children, attributes);
    }
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>) {
        const attributes: YJoinAttributes = {
            ...YJoin.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();

        const widthIfStretch = attributes.width || this.children.reduce((p, c) => {
            const w = c.render(inheritedProps(attributes)).width;
            if (w == null) return p;
            return Math.max(p, w);
        }, -Infinity);

        let cumulatedHeight = 0;

        const rendersNoFlexGrow = this.children.map((v) => {
            if (v.attributes.flexGrow) return null;
            const render = v.render(inheritedProps(attributes), {
                ...(attributes.widthAlign === 'stretch' ? { width: widthIfStretch } : {}),
            });
            cumulatedHeight += render.height;
            return render;
        });

        const flexGrowTotal = this.children.reduce((p, c) => p + +(c.attributes.flexGrow || 0), 0);

        const remainingSpace = attributes.height != null ? attributes.height - cumulatedHeight : null;

        const unitOfFlexGrowSpace = remainingSpace != null && flexGrowTotal !== 0 ? remainingSpace / flexGrowTotal : null;

        let usedRemainingSpace = 0;

        const rendersYesFlexGrow = this.children.map((v) => {
            if (!v.attributes.flexGrow) return null;
            if (unitOfFlexGrowSpace != null && remainingSpace != null) {
                const prevUsedRemSpace = usedRemainingSpace;
                usedRemainingSpace += unitOfFlexGrowSpace;
                return v.render(inheritedProps(attributes), {
                    ...(attributes.widthAlign === 'stretch' ? { width: widthIfStretch } : {}),
                    height: Math.round(usedRemainingSpace) - Math.round(prevUsedRemSpace),
                });
            }
            return v.render(inheritedProps(attributes));
        });

        const renders = rendersNoFlexGrow.map((v, i) => v != null ? v : rendersYesFlexGrow[i]) as RichCharGrid[];

        const result = new RichCharGrid();

        const width = attributes.widthAlign === 'stretch'
            ? widthIfStretch
            : Math.max(...renders.map((v) => v.width));

        if (renders.length === 0) return RichCharGrid.fill(attributes.width || 0, attributes.height || 0, fillChar);
        
        const contentsHeight = renders.reduce((c, v) => c + v.height, 0);
        // space-between: w / (n - 1)
        // space-around: w / n
        // space-evenly: w / (n + 1)
        let gapHeight: number;
        if (typeof attributes.gap === 'number') {
            gapHeight = attributes.gap;
        } else if (attributes.height != null) {
            const mappingTable = {
                'space-between': renders.length - 1,
                'space-around': renders.length,
                'space-evenly': renders.length + 1,
            };
            gapHeight = (attributes.height - contentsHeight) / mappingTable[attributes.gap];
        } else {
            gapHeight = 0;
        }

        let gapCumul = 0;

        for (let render of renders) {
            if (attributes.widthAlign !== 'stretch') render.setWidth(width, alignInvrt[attributes.widthAlign], fillChar);
            if (render !== renders[0]) {
                const gapConstituent = new RichCharGrid([[]]);
                const lastCumul = gapCumul;
                gapCumul += gapHeight;
                gapConstituent.setHeight(Math.round(gapCumul - lastCumul), 'end', fillChar);
                gapConstituent.setWidth(width, 'end', fillChar);
                result.mergeY(gapConstituent);
            }
            result.mergeY(render);
        } 
        if (attributes.height != null) result.setHeight(attributes.height, alignInvrt[attributes.heightAlign], fillChar);
        return result;
    }
}

export interface YJoinAttributes extends MinitelObjectAttributes {
    gap: number | 'space-between' | 'space-around' | 'space-evenly';
    widthAlign: Align | 'stretch';
    heightAlign: Align;
}
