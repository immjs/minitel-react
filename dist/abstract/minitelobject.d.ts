import type { Minitel } from '../components/minitel.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
export declare class MinitelObject {
    children: MinitelObject[];
    attributes: Partial<MinitelObjectAttributes>;
    parent?: MinitelObject;
    static defaultAttributes: MinitelObjectAttributes;
    constructor(children?: MinitelObject[], attributes?: Partial<MinitelObjectAttributes>);
    appendChild(child: MinitelObject): void;
    insertBeforeChild(child: MinitelObject, beforeChild: MinitelObject): void;
    removeChild(child: MinitelObject): void;
    minitel(): Minitel;
    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>): RichCharGrid;
}
