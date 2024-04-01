import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
export declare class XJoin extends MinitelObject {
    constructor(children?: MinitelObject[], attributes?: Partial<MinitelObjectAttributes>);
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>): RichCharGrid;
}
