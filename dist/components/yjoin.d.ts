import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import type { Minitel } from './minitel.js';
export declare class YJoin extends MinitelObject<YJoinAttributes> {
    static defaultAttributes: YJoinAttributes;
    defaultAttributes: YJoinAttributes;
    constructor(children: MinitelObject[], attributes: Partial<MinitelObjectAttributes>, minitel: Minitel);
    render(attributes: YJoinAttributes, inheritMe: Partial<YJoinAttributes>): RichCharGrid;
}
export interface YJoinAttributes extends MinitelObjectAttributes {
    gap: number | 'space-between' | 'space-around' | 'space-evenly';
    widthAlign: Align | 'stretch';
    heightAlign: Align;
}
