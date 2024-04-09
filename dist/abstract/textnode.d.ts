import { MinitelObject } from './minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes, RenderLinesAttributes } from '../types.js';
import type { Minitel } from '../index.js';
export declare class TextNode extends MinitelObject {
    text: string;
    constructor(text: string, attributes: Partial<MinitelObjectAttributes>, minitel: Minitel);
    render(attributes: MinitelObjectAttributes, inheritMe: Partial<MinitelObjectAttributes>): RichCharGrid;
    renderLines(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes: Partial<RenderLinesAttributes>): RichCharGrid[];
}
