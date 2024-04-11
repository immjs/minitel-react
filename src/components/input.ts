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
        super(children, attributes, minitel);

        this.on('key', this.keyEventListener);
    }
    keyEventListener(key: string) {
        if (/^[a-zA-Z0-9,\.';\-\:?!"#$%&\(\)\[\]<>@+=*/ ]$/g.test(key)) {
            this.value += key;
            if (this.attributes.onChange) this.attributes.onChange(this);
            this.minitel.renderToStream();
        } else if (key === '\x13\x47') {
            this.value = this.value.slice(0, -1);
            if (this.attributes.onChange) this.attributes.onChange(this);
            this.minitel.renderToStream();
        }
    }
    unmount() {
        this.off('key', this.keyEventListener);
    }
    render(attributes: InputAttributes, inheritMe: Partial<InputAttributes>) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();

        // TODO: fix types
        return RichCharGrid.fromLine({
            text: this.value,
            password: '-'.repeat(this.value.length),
        }[attributes.type].slice(-attributes.width!), inheritMe).setWidth(attributes.width!, 'end', fillChar);
    }
    get focusCursorAt() {
        return [0, this.value.length] as [number, number];
    }
}

export interface InputAttributes extends FocusableAttributes {
    type: 'text' | 'password';
    onChange: (input: Input) => void,
}
