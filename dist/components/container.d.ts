import { MinitelObject } from '../abstract/minitelobject.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import type { Minitel } from './minitel.js';
export declare class Container<T extends ContainerAttributes = ContainerAttributes, U extends Record<string, any[]> = Record<string, any[]>> extends MinitelObject<T, U> {
    static defaultAttributes: ContainerAttributes;
    defaultAttributes: T;
    constructor(children: never[] | undefined, attributes: Partial<T>, minitel: Minitel);
    render(attributes: ContainerAttributes, inheritMe: Partial<ContainerAttributes>): import("../richchargrid.js").RichCharGrid;
}
export interface ContainerAttributes extends MinitelObjectAttributes {
    widthAlign: Align;
    heightAlign: Align;
}
