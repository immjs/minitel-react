import { Container } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { SingletonArray } from '../singleton.js';
import { RichChar } from '../richchar.js';
export class Minitel extends Container {
    constructor(stream, attributes) {
        super([], attributes);
        this.children = new SingletonArray();
        this.stream = stream;
        this.previousRender = RichCharGrid.fill(40, 24, new RichChar(' '));
        // TBD.
        // this.rxQueue = new FifoQueue();
    }
    renderString() {
        const renderGrid = this.children[0].render({}, {
            width: 40,
            height: 24,
        });
        renderGrid.setHeight(24, 'start', new RichChar(' '));
        renderGrid.setWidth(40, 'start', new RichChar(' '));
        const outputString = [];
        let lastAttributes = {
            fg: 7,
            bg: 0,
            underline: false,
            doubleWidth: false,
            doubleHeight: false,
            noBlink: true,
            invert: false,
        };
        for (let line of renderGrid.grid) {
            for (let char of line) {
                const diff = char.attributesDiff(lastAttributes);
                const applier = RichChar.getAttributesApplier(diff, lastAttributes);
                if (applier != '') {
                    outputString.push(applier);
                }
                outputString.push(char.char);
                lastAttributes = char.attributes;
            }
            if (lastAttributes.doubleHeight)
                outputString.push('\x0b');
        }
        return outputString.join('');
    }
    renderToStream() {
        this.stream.write('\x0c');
        this.stream.write(this.renderString());
    }
    minitel() {
        return this;
    }
}
