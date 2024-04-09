import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
export class Input extends MinitelObject {
    constructor(children, attributes, minitel) {
        super([], attributes, minitel);
        this.defaultAttributes = Input.defaultAttributes;
        this.value = '';
        this.focused = false;
        this.disabled = false;
        this.keepElmDesc = true;
        this.on('key', (key) => {
            if (/^[a-zA-Z0-9 ]$/gi.test(key)) {
                this.value += key;
                minitel.renderToStream();
            }
            else if (key === '\x13\x47') {
                this.value = this.value.slice(0, -1);
                minitel.renderToStream();
            }
        });
    }
    render(attributes, inheritMe) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        // TODO: fix types
        return RichCharGrid.fromLine({
            text: this.value,
            password: '-'.repeat(this.value.length),
        }[attributes.type], {}).setWidth(attributes.width, 'end', fillChar);
    }
    get focusCursorAt() {
        return [0, Math.max(this.value.length)];
    }
}
Input.defaultAttributes = Object.assign(Object.assign({}, MinitelObject.defaultAttributes), { fillChar: '.', width: 8, height: 1, type: 'text', autofocus: false });
