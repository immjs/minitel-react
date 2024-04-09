import { Focusable, FocusableAttributes } from '../abstract/focusable.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { SingletonArray } from '../singleton.js';
import type { Minitel } from './minitel.js';

export class Input extends MinitelObject<InputAttributes, { key: [string] }> implements Focusable {
    static defaultAttributes: InputAttributes = {
        ...MinitelObject.defaultAttributes,
        fillChar: '.',
        width: 8,
        height: 1,
        type: 'text',
        autofocus: false,
        onChange: () => {},
    };
    defaultAttributes = Input.defaultAttributes;
    value = '';
    focused = false;
    disabled = false;
    keepElmDesc = true as const;
    constructor(children: [], attributes: Partial<InputAttributes>, minitel: Minitel) {
        super([], attributes, minitel);

        this.on('key', (key) => {
            if (/^[a-zA-Z0-9 ]$/gi.test(key)) {
                this.value += key;
                if (attributes.onChange) attributes.onChange(this);
                minitel.renderToStream();
            } else if (key === '\x13\x47') {
                this.value = this.value.slice(0, -1);
                if (attributes.onChange) attributes.onChange(this);
                minitel.renderToStream();
            }
        });
    }
    render(attributes: InputAttributes, inheritMe: Partial<InputAttributes>) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();

        // TODO: fix types
        return RichCharGrid.fromLine({
            text: this.value,
            password: '-'.repeat(this.value.length),
        }[attributes.type].slice(-attributes.width!), {}).setWidth(attributes.width!, 'end', fillChar);
    }
    get focusCursorAt() {
        return [0, Math.max(this.value.length)] as [number, number];
    }
}

export interface InputAttributes extends FocusableAttributes {
    type: 'text' | 'password';
    onChange: (input: Input) => void,
}
