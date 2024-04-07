import { Duplex } from 'stream';
import { Container } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { CharAttributes, MinitelObjectAttributes } from '../types.js';
import { SingletonArray } from '../singleton.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { FiberRoot } from 'react-reconciler';

export class Minitel extends Container {
    static defaultScreenAttributes: CharAttributes = {
        fg: 7,
        bg: 0,
        underline: false,
        doubleWidth: false,
        doubleHeight: false,
        noBlink: true,
        invert: false,
    };
    stream: Duplex;
    previousRender: RichCharGrid;
    _rootContainer?: FiberRoot;
    constructor(stream: Duplex, attributes?: Partial<MinitelObjectAttributes>) {
        super([], attributes)
        this.children = new SingletonArray<MinitelObject>();
        this.stream = stream;
        this.previousRender = RichCharGrid.fill(40, 24, new RichChar(' '));
        this.stream.write('\x0c');

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
        let lastAttributes: CharAttributes = {
            fg: 7,
            bg: 0,
            underline: false,
            doubleWidth: false,
            doubleHeight: false,
            noBlink: true,
            invert: false,
        };
        let skippedACharCounter = 0;
        for (let lineIdx in renderGrid.grid) {
            const line = renderGrid.grid[lineIdx];
            for (let charIdx in line) {
                const char = line[charIdx];
                const prevChar = this.previousRender.grid[lineIdx][charIdx];
                if (this.previousRender.grid[lineIdx][charIdx].isEqual(char)) {
                    if (char.char !== '') skippedACharCounter += 1;
                } else {
                    if (skippedACharCounter === 0) {
                        const diff = char.attributesDiff(lastAttributes);
                        const applier = RichChar.getAttributesApplier(diff, lastAttributes);
                        if (applier != '') {
                            outputString.push(applier);
                        }
                        lastAttributes = char.attributes;
                    } else {
                        outputString.push([
                            '\x1f',
                            String.fromCharCode(64 + +lineIdx + 1),
                            String.fromCharCode(64 + +charIdx + 1),
                        ].join(''));
                        const diff = char.attributesDiff(lastAttributes);
                        const applier = RichChar.getAttributesApplier(diff, lastAttributes);
                        if (applier != '') {
                            outputString.push(applier);
                        }
                    }

                    outputString.push(char.char)
                    skippedACharCounter = 0;
                }
            }
            if (lastAttributes.doubleHeight) outputString.push('\x0b');
        }
        this.previousRender = renderGrid.copy();
        // if i get bullied in prépa, it will be because of this
        let preOptimized = outputString.join('\x80');
        preOptimized = preOptimized.replace(
            /(.)(€\1){2,62}/g,
            (v) => `${v[0]}\x12${String.fromCharCode((v.length + 1) / 2 + 63)}`,
        );
        // console.log(JSON.stringify(preOptimized));
        return preOptimized.split('\x80').join('');
    }
    renderToStream() {
        // this.stream.write('\x0c');
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
