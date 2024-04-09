import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import type { Minitel } from './minitel.js';
export declare class XJoin extends MinitelObject<XJoinAttributes> {
    static defaultAttributes: XJoinAttributes;
    defaultAttributes: XJoinAttributes;
    constructor(children: MinitelObject[], attributes: Partial<MinitelObjectAttributes>, minitel: Minitel);
    render(attributes: XJoinAttributes, inheritMe: Partial<XJoinAttributes>): RichCharGrid;
}
export interface XJoinAttributes extends MinitelObjectAttributes {
    gap: number | 'space-between' | 'space-around' | 'space-evenly';
    widthAlign: Align;
    heightAlign: Align | 'stretch';
}
