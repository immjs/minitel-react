import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';

export class XJoin extends MinitelObject {
    static defaultAttributes: XJoinAttributes = {
        ...MinitelObject.defaultAttributes,
        gap: 0,
        widthAlign: 'start',
        heightAlign: 'stretch',
    }
    constructor(children: MinitelObject[] = [], attributes: Partial<MinitelObjectAttributes> = {}) {
        super(children, attributes);
    }
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>) {
        const attributes: XJoinAttributes = {
            ...XJoin.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();

        const heightIfStretch = attributes.height || this.children.reduce((p, c) => {
            const h = c.render(inheritedProps(attributes)).height;
            if (h == null) return p;
            return Math.max(p, h);
        }, -Infinity);

        let cumulatedWidth = 0;

        const rendersNoFlexGrow = this.children.map((v) => {
            if (v.attributes.flexGrow) return null;
            const render = v.render(inheritedProps(attributes), {
                ...(attributes.heightAlign === 'stretch' ? { height: heightIfStretch } : {}),
            });
            cumulatedWidth += render.width;
            return render;
        });

        const flexGrowTotal = this.children.reduce((p, c) => p + +(c.attributes.flexGrow || 0), 0);

        const remainingSpace = attributes.width != null ? attributes.width - cumulatedWidth : null;

        const unitOfFlexGrowSpace = remainingSpace != null ? remainingSpace / flexGrowTotal : null;

        let usedRemainingSpace = 0;

        const rendersYesFlexGrow = this.children.map((v) => {
            if (!v.attributes.flexGrow) return null;
            if (unitOfFlexGrowSpace != null && remainingSpace != null) {
                const prevUsedRemSpace = usedRemainingSpace;
                usedRemainingSpace += unitOfFlexGrowSpace;
                return v.render(inheritedProps(attributes), {
                    ...(attributes.heightAlign === 'stretch' ? { height: heightIfStretch } : {}),
                    width: Math.round(usedRemainingSpace) - Math.round(prevUsedRemSpace),
                });
            }
            return v.render(inheritedProps(attributes));
        });

        const renders = rendersNoFlexGrow.map((v, i) => v != null ? v : rendersYesFlexGrow[i]) as RichCharGrid[];

        const result = new RichCharGrid();

        const height = attributes.heightAlign === 'stretch'
            ? heightIfStretch
            : Math.max(...renders.map((v) => v.height));

        if (renders.length === 0) return RichCharGrid.fill(attributes.width || 0, attributes.height || 0, fillChar);

        const contentsWidth = renders.reduce((c, v) => c + v.width, 0);
        // space-between: w / (n - 1)
        // space-around: w / n
        // space-evenly: w / (n + 1)
        let gapWidth: number;
        if (typeof attributes.gap === 'number') {
            gapWidth = attributes.gap;
        } else if (attributes.width != null) {
            const mappingTable = {
                'space-between': renders.length - 1,
                'space-around': renders.length,
                'space-evenly': renders.length + 1,
            };
            gapWidth = (attributes.width - contentsWidth) / mappingTable[attributes.gap];
        } else {
            gapWidth = 0;
        }

        let gapCumul = 0;

        for (let render of renders) {
            if (attributes.heightAlign !== 'stretch') render.setHeight(height, alignInvrt[attributes.heightAlign], fillChar);
            if (render !== renders[0]) {
                const gapConstituent = new RichCharGrid([]);
                const lastCumul = gapCumul;
                gapCumul += gapWidth;
                gapConstituent.setWidth(Math.round(gapCumul) - Math.round(lastCumul), 'end', fillChar);
                gapConstituent.setHeight(height, 'end', fillChar);
                result.mergeX(gapConstituent);
            }
            result.mergeX(render);
        }
        if (attributes.width != null) result.setWidth(attributes.width, alignInvrt[attributes.widthAlign], fillChar);
        return result;
    }
}

export interface XJoinAttributes extends MinitelObjectAttributes {
    gap: number | 'space-between' | 'space-around' | 'space-evenly';
    widthAlign: Align;
    heightAlign: Align | 'stretch';
}
