import { Focusable, FocusableAttributes } from '../abstract/focusable.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import type { Minitel } from './minitel.js';

export class Input
    extends MinitelObject<InputAttributes, { key: [string] }>
    implements Focusable
{
    static defaultAttributes: InputAttributes = {
        ...MinitelObject.defaultAttributes,
        fillChar: '.',
        width: 8,
        height: 1,
        type: 'text',
        autofocus: false,
        multiline: false,
        onChange: () => {},
    };
    defaultAttributes = Input.defaultAttributes;
    value = '';
    focused = false;
    disabled = false;
    keepElmDesc = true as const;
    focusCursorAt = [0, 0] as [number, number];
    lastFocusCursorX = 0;
    constructor(
        children: [],
        attributes: Partial<InputAttributes>,
        minitel: Minitel,
    ) {
        super(children, attributes, minitel);
        
        this.on('key', this.keyEventListener);
    }
    keyEventListener(key: string) {
        let currentLine: string;
        switch (key) {
            case '\x1b\x5b\x41': // up
            if (this.attributes.multiline) {
                this.focusCursorAt[0] -= 1;
                this.focusCursorAt[0] = Math.max(this.focusCursorAt[0], 0);
                
                currentLine = this.value.split('\n')[this.focusCursorAt[0]];
                this.focusCursorAt[1] = Math.min(
                    this.lastFocusCursorX,
                    currentLine.length,
                );
                
                this.minitel.queueImmediateRenderToStream();
            }
            break;
            case '\x1b\x5b\x42': // down
            if (this.attributes.multiline) {
                this.focusCursorAt[0] += 1;
                this.focusCursorAt[0] = Math.min(
                    this.focusCursorAt[1],
                    this.value.split('\n').length,
                );
                
                currentLine = this.value.split('\n')[this.focusCursorAt[0]];
                this.focusCursorAt[1] = Math.min(
                    this.lastFocusCursorX,
                    currentLine.length,
                );
                
                this.minitel.queueImmediateRenderToStream();
            }
            break;
            case '\x1b\x5b\x43': // right
            this.focusCursorAt[1] += 1;
            
            currentLine = this.value.split('\n')[this.focusCursorAt[0]];
            if (this.focusCursorAt[1] > currentLine.length) {
                this.focusCursorAt[0] += 1;
                this.focusCursorAt[0] = Math.min(
                    this.focusCursorAt[0],
                    this.value.split('\n').length,
                );
                this.focusCursorAt[1] = 0;
            }
            this.lastFocusCursorX = this.focusCursorAt[1];
            
            this.minitel.queueImmediateRenderToStream();
            break;
            case '\x1b\x5b\x44': // left
            this.focusCursorAt[1] -= 1;
            
            if (this.focusCursorAt[1] < 0) {
                this.focusCursorAt[0] -= 1;
                this.focusCursorAt[0] = Math.max(this.focusCursorAt[0], 0);
                currentLine = this.value.split('\n')[this.focusCursorAt[0]];
                this.focusCursorAt[1] = currentLine.length;
            }
            this.lastFocusCursorX = this.focusCursorAt[1];
            
            this.minitel.queueImmediateRenderToStream();
            break;
            default:
        if (/^[a-zA-Z0-9,\.';\-\:?!"#$%&\(\)\[\]<>@+=*/ ]$/g.test(key)) {
            this.value += key;
            if (this.attributes.onChange) this.attributes.onChange(this.value);
        } else if (key === '\x13\x47') {
            this.value = this.value.slice(0, -1);
            if (this.attributes.onChange) this.attributes.onChange(this.value);
        }
        this.minitel.queueImmediateRenderToStream();
    }
}
unmount() {
    this.off('key', this.keyEventListener);
}
render(attributes: InputAttributes, inheritMe: Partial<InputAttributes>) {
    const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
    
    // TODO: fix types
    return RichCharGrid.fromLine(
        {
            text: this.value,
            password: '-'.repeat(this.value.length),
        }[attributes.type].slice(-attributes.width!),
        inheritMe,
    ).setWidth(attributes.width!, 'end', fillChar);
}
}

export interface InputAttributes extends FocusableAttributes {
    type: 'text' | 'password';
    multiline: boolean;
    onChange: (value: string) => void;
}
