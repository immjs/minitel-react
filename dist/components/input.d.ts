import { Focusable, FocusableAttributes } from '../abstract/focusable.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichCharGrid } from '../richchargrid.js';
import type { Minitel } from './minitel.js';
export declare class Input extends MinitelObject<InputAttributes, {
    key: [string];
}> implements Focusable {
    static defaultAttributes: InputAttributes;
    defaultAttributes: InputAttributes;
    value: string;
    focused: boolean;
    disabled: boolean;
    keepElmDesc: true;
    focusCursorAt: [number, number];
    lastFocusCursorX: number;
    constructor(children: [], attributes: Partial<InputAttributes>, minitel: Minitel);
    keyEventListener(key: string): void;
    unmount(): void;
    render(attributes: InputAttributes, inheritMe: Partial<InputAttributes>): RichCharGrid;
}
export interface InputAttributes extends FocusableAttributes {
    type: 'text' | 'password';
    multiline: boolean;
    onChange: (value: string) => void;
}
