import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes, RenderLinesAttributes } from '../types.js';
export declare class TextNode extends MinitelObject {
    text: string;
    constructor(text: string, attributes?: Partial<MinitelObjectAttributes>);
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes: Partial<MinitelObjectAttributes>): RichCharGrid;
    renderLines(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes: Partial<RenderLinesAttributes>): RichCharGrid[];
}
