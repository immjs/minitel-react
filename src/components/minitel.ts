import { Duplex } from 'stream';
import { Container } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { SingletonArray } from '../singleton.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { FiberRoot } from 'react-reconciler';

export class Minitel extends Container {
    stream: Duplex;
    previousRender: RichCharGrid;
    _rootContainer?: FiberRoot;
    constructor(stream: Duplex, attributes?: Partial<MinitelObjectAttributes>) {
        super([], attributes)
        this.children = new SingletonArray<MinitelObject>();
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
            sizeCode: 0,
            noBlink: true,
            invert: false,
        };
        for (let line of renderGrid.grid) {
            for (let char of line) {
                const diff = char.attributesDiff(lastAttributes);
                const applier = RichChar.getAttributesApplier(diff);
                if (applier != '') {
                    outputString.push(applier);
                    if (char.char !== ' ') outputString.push(' \x08');
                }
                outputString.push(char.char)
                lastAttributes = char.attributes;
            }
            // outputString.push('\r\n');
        }
        return outputString.join('');
    }
    renderToStream() {
        this.stream.write('\x0c')
        this.stream.write(this.renderString());
    }
    minitel(): Minitel {
        return this;
    }
    // sendProtocole(seq: string) {
    //     this.stream.write(`\x1b${['\x39', '\x3A', '\x3B'][seq.length]}${seq}`);
    // }
    // acqCallback(callback = () => {}) {
    //     this.rxQueue.enqueue(callback);
    // }
}
