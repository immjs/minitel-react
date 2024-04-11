import { Focusable } from '../abstract/focusable.js';
import { RichCharGrid } from '../richchargrid.js';
import { Container, ContainerAttributes } from './container.js';
import type { Minitel } from './minitel.js';
export declare class Scrollable extends Container<ScrollableAttributes, {
    key: [string];
}> implements Focusable {
    static defaultAttributes: ScrollableAttributes;
    defaultAttributes: ScrollableAttributes;
    scrollDeltaX: number;
    scrollDeltaY: number;
    focused: boolean;
    disabled: boolean;
    keepElmDesc: true;
    constructor(children: never[] | undefined, attributes: Partial<ScrollableAttributes>, minitel: Minitel);
    render(attributes: ScrollableAttributes, inheritMe: Partial<ScrollableAttributes>): RichCharGrid;
}
export interface ScrollableAttributes extends ContainerAttributes {
    overflowX: 'scroll' | 'pad' | 'auto' | 'hidden';
    overflowY: 'scroll' | 'pad' | 'auto' | 'hidden';
    autofocus: false;
}
