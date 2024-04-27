import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
export class Input extends MinitelObject {
    constructor(children, attributes, minitel) {
        super(children, attributes, minitel);
        this.defaultAttributes = Input.defaultAttributes;
        this.value = '';
        this.focused = false;
        this.disabled = false;
        this.keepElmDesc = true;
        this.focusCursorAt = [0, 0];
        this.lastFocusCursorX = 0;
        this.on('key', this.keyEventListener);
    }
    keyEventListener(key) {
        let currentLine;
        switch (key) {
            case '\x1b\x5b\x41': // up
                if (this.attributes.multiline) {
                    this.focusCursorAt[0] -= 1;
                    this.focusCursorAt[0] = Math.max(this.focusCursorAt[0], 0);
                    currentLine = this.value.split('\n')[this.focusCursorAt[0]];
                    this.focusCursorAt[1] = Math.min(this.lastFocusCursorX, currentLine.length);
                    this.minitel.queueImmediateRenderToStream();
                }
                break;
            case '\x1b\x5b\x42': // down
                if (this.attributes.multiline) {
                    this.focusCursorAt[0] += 1;
                    this.focusCursorAt[0] = Math.min(this.focusCursorAt[1], this.value.split('\n').length);
                    currentLine = this.value.split('\n')[this.focusCursorAt[0]];
                    this.focusCursorAt[1] = Math.min(this.lastFocusCursorX, currentLine.length);
                    this.minitel.queueImmediateRenderToStream();
                }
                break;
            case '\x1b\x5b\x43': // right
                this.focusCursorAt[1] += 1;
                currentLine = this.value.split('\n')[this.focusCursorAt[0]];
                if (this.focusCursorAt[1] > currentLine.length) {
                    this.focusCursorAt[0] += 1;
                    this.focusCursorAt[0] = Math.min(this.focusCursorAt[0], this.value.split('\n').length);
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
                    if (this.attributes.onChange)
                        this.attributes.onChange(this.value);
                }
                else if (key === '\x13\x47') {
                    this.value = this.value.slice(0, -1);
                    if (this.attributes.onChange)
                        this.attributes.onChange(this.value);
                }
                this.minitel.queueImmediateRenderToStream();
        }
    }
    unmount() {
        this.off('key', this.keyEventListener);
    }
    render(attributes, inheritMe) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        // TODO: fix types
        return RichCharGrid.fromLine({
            text: this.value,
            password: '-'.repeat(this.value.length),
        }[attributes.type].slice(-attributes.width), inheritMe).setWidth(attributes.width, 'end', fillChar);
    }
}
Input.defaultAttributes = Object.assign(Object.assign({}, MinitelObject.defaultAttributes), { fillChar: '.', width: 8, height: 1, type: 'text', autofocus: false, multiline: false, onChange: () => { } });
