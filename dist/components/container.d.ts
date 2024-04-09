import { MinitelObject } from '../abstract/minitelobject.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import type { Minitel } from './minitel.js';
export declare class Container extends MinitelObject<ContainerAttributes> {
    static defaultAttributes: ContainerAttributes;
    defaultAttributes: ContainerAttributes;
    constructor(children: never[] | undefined, attributes: Partial<ContainerAttributes>, minitel: Minitel);
    render(attributes: ContainerAttributes, inheritMe: Partial<ContainerAttributes>): import("../richchargrid.js").RichCharGrid;
}
export interface ContainerAttributes extends MinitelObjectAttributes {
    widthAlign: Align;
    heightAlign: Align;
}
