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
    constructor(children: [], attributes: Partial<InputAttributes>, minitel: Minitel);
    render(attributes: InputAttributes, inheritMe: Partial<InputAttributes>): RichCharGrid;
    get focusCursorAt(): [number, number];
}
export interface InputAttributes extends FocusableAttributes {
    type: 'text' | 'password';
    onChange: (input: Input) => void;
}
