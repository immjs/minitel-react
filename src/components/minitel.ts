import { Duplex } from 'stream';
import { Container } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { CharAttributes, MinitelObjectAttributes } from '../types.js';
import { SingletonArray } from '../singleton.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { FiberRoot } from 'react-reconciler';

export interface MinitelSettings {
    statusBar: boolean;
}

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
    settings: MinitelSettings;
    constructor(stream: Duplex, settings: Partial<MinitelSettings>) {
        super([], {})
        this.children = new SingletonArray<MinitelObject>();
        this.settings = {
            statusBar: false,
            ...settings,
        };
        this.stream = stream;
        this.previousRender = RichCharGrid.fill(40, 24 + +this.settings.statusBar, new RichChar(' '));
        this.stream.write('\x1f\x40\x41\x18\x0c');

        // TBD.
        // this.rxQueue = new FifoQueue();
    }
    renderString() {
        const renderGrid = this.children[0].render({}, {
            width: 40,
            height: 24 + +this.settings.statusBar,
        });

        renderGrid.setHeight(24 + +this.settings.statusBar, 'start', new RichChar(' '));
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
            if (+lineIdx === 0 && this.settings.statusBar) outputString.push('\x1f\x40\x41');
            const line = renderGrid.grid[lineIdx];
            for (let charIdx in line) {
                const char = line[charIdx];

                if (this.previousRender.grid[lineIdx][charIdx].isEqual(char)) {
                    if (char.char !== '') skippedACharCounter += 1;
                    lastAttributes = {
                        fg: 7,
                        doubleWidth: false,
                        doubleHeight: false,
                        noBlink: true,
                        invert: false,
                        ...RichChar.getDelimited(char.attributes),
                    };
                } else {
                    if (skippedACharCounter !== 0) {
                        outputString.push([
                            '\x1f',
                            String.fromCharCode(64 + +lineIdx + 1 - (+this.settings.statusBar)),
                            String.fromCharCode(64 + +charIdx + 1),
                        ].join(''));
                    }
                    // outputString.push('\x09'.repeat(skippedACharCounter));
                    const diff = char.attributesDiff(lastAttributes);
                    const applier = RichChar.getAttributesApplier(diff, lastAttributes);
                    outputString.push(applier);

                    lastAttributes = char.attributes;

                    outputString.push(char.char)
                    skippedACharCounter = 0;
                }
            }
            if (lastAttributes.doubleHeight) outputString.push('\x0b');
            if (+lineIdx === 0 && this.settings.statusBar) outputString.push('\x1f\x41\x41');
            lastAttributes = {
                fg: 7,
                bg: 0,
                underline: false,
                doubleWidth: false,
                doubleHeight: false,
                noBlink: true,
                invert: false,
            };
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
