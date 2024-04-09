import { MinitelObjectAttributes } from '../types.js';
import { MinitelObject } from './minitelobject.js';
export interface Focusable extends MinitelObject<FocusableAttributes, {
    key: [string];
}> {
    focused: boolean;
    disabled: boolean;
    focusCursorAt?: [number, number];
    keepElmDesc: true;
}
export interface FocusableAttributes extends MinitelObjectAttributes {
    autofocus: boolean;
}
