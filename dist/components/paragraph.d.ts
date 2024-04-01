import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { TextNode } from './textnode.js';
export declare class Paragraph extends MinitelObject {
    children: TextNode[];
    constructor(children: TextNode[], attributes?: Partial<MinitelObjectAttributes>);
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>): RichCharGrid;
}
