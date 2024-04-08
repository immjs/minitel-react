import { MinitelObject } from '../abstract/minitelobject.js';
import { Align, MinitelObjectAttributes } from '../types.js';
export declare class Container extends MinitelObject {
    static defaultAttributes: ContainerAttributes;
    constructor(children?: never[], attributes?: Partial<ContainerAttributes>);
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>): import("../richchargrid.js").RichCharGrid;
}
export interface ContainerAttributes extends MinitelObjectAttributes {
    widthAlign: Align;
    heightAlign: Align;
}
