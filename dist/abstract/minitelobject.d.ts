/// <reference types="node" resolution-mode="require"/>
import { EventEmitter } from 'node:events';
import type { Minitel } from '../components/minitel.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { Focusable } from './focusable.js';
export declare class MinitelObject<T extends MinitelObjectAttributes = MinitelObjectAttributes, U extends Record<string, any[]> = Record<string, any[]>> extends EventEmitter<U> {
    children: MinitelObject[];
    attributes: Partial<T>;
    parent?: MinitelObject;
    minitel: Minitel;
    keepElmDesc: boolean;
    static defaultAttributes: MinitelObjectAttributes;
    defaultAttributes: T;
    constructor(children: MinitelObject[], attributes: Partial<T>, minitel: Minitel);
    appendChild(child: MinitelObject): void;
    insertBeforeChild(child: MinitelObject, beforeChild: MinitelObject): void;
    removeChild(child: MinitelObject): void;
    render(attributes: T, inheritMe: Partial<T>): RichCharGrid;
    renderWrapper(inheritedAttributes: Partial<T>, forcedAttributes?: Partial<T>): RichCharGrid;
    focusables(): Focusable[];
}
