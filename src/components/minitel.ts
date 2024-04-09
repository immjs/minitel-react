import { Duplex } from 'stream';
import { Container, ContainerAttributes } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { CharAttributes, MinitelObjectAttributes } from '../types.js';
import { SingletonArray } from '../singleton.js';
import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { FiberRoot } from 'react-reconciler';
import React from 'react';
import { Focusable } from '../abstract/focusable.js';
import { expectNextChars } from '../inputConstants.js';

export interface MinitelSettings {
    statusBar: boolean;
    localEcho: boolean;
}

export class Minitel extends Container<ContainerAttributes, { key: [string] }> {
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
    focusedObj: Focusable | null = null;
    lastImmediate: NodeJS.Immediate | null = null;
    constructor(stream: Duplex, settings: Partial<MinitelSettings>) {
        const that = null as unknown as Minitel;
        super([], {}, that);
        this.minitel = this;
        this.children = new SingletonArray<MinitelObject>();
        this.settings = {
            statusBar: false,
            localEcho: false,
            ...settings,
        };
        this.stream = stream;
        this.previousRender = RichCharGrid.fill(40, 24 + +this.settings.statusBar, new RichChar(' '));

        // Take care of localEcho
        this.stream.write([
            '\x1b\x3b',
            this.settings.localEcho ? '\x61' : '\x60',
            '\x58',
            '\x52',
        ].join(''));

        this.stream.write('\x1f\x40\x41\x18\x0c'); // Clear status; clear screen

        let acc = '';
        let howManyToExpect = 0;
        this.stream.on('data', (data: Buffer) => {
            const str = data.toString();
            for (let char of str) {
                howManyToExpect = Math.max(0, howManyToExpect - 1);
                acc += char;
                howManyToExpect = Math.max(0, howManyToExpect + (expectNextChars[acc] || 0));
                if (howManyToExpect === 0) {
                    this.emit('key', acc);
                    if (acc.match(/^([a-z0-9 ]|\x13\x47)$/gi)) {
                        const focusedObj = this.focusedObj;
                        if (focusedObj) {
                            focusedObj.emit('key', acc);
                        }
                    } else if (acc === '\x13\x48' || acc === '\x13\x42') {
                        const deltaTable: Record<'\x13\x48' | '\x13\x42', number> = {
                            '\x13\x48': 1,
                            '\x13\x42': -1,
                        };
                        this.focusDelta(deltaTable[acc]);
                        this.renderToStream();
                    }
                    acc = '';
                    continue;
                }
            }
        });

        // TBD.
        // this.rxQueue = new FifoQueue();
    }
    renderString(): string {
        const renderGrid = this.renderWrapper({}, {
            width: 40,
            height: 24 + +this.settings.statusBar,
        });

        renderGrid.setHeight(24 + +this.settings.statusBar, 'start', new RichChar(' '));
        renderGrid.setWidth(40, 'start', new RichChar(' '));

        this.handleFocus();

        const outputString = [];
        let lastAttributes: Readonly<CharAttributes> = Minitel.defaultScreenAttributes;
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
                        outputString.push(this.toCursorMove(+lineIdx, +charIdx));
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
            lastAttributes = Minitel.defaultScreenAttributes;
        }
        this.previousRender = renderGrid.copy();

        if (this.focusedObj && 'focusCursorAt' in this.focusedObj && this.focusedObj.focusCursorAt != null) {
            const { x, y, w, h } = renderGrid.locationDescriptors.get(this.focusedObj)!;
            const [cursorDeltaY, cursorDeltaX] = this.focusedObj.focusCursorAt;

            outputString.push(this.toCursorMove(
                Math.min(y + cursorDeltaY, y + h - 1),
                Math.min(x + cursorDeltaX, x + w - 1),
            ));
            outputString.push('\x11');
        }
        // if i get bullied in prépa, it will be because of this
        let preOptimized = outputString.join('\x80');
        preOptimized = preOptimized.replace(
            /(.)(€\1){2,62}/g,
            (v) => `${v[0]}\x12${String.fromCharCode((v.length + 1) / 2 + 63)}`,
        );

        // console.log(JSON.stringify(preOptimized));
        return preOptimized.split('\x80').join('');
    }
    toCursorMove(y: number, x: number) {
        return [
            '\x1f',
            String.fromCharCode(64 + y + (this.settings.statusBar ? 0 : 1)),
            String.fromCharCode(64 + x + 1),
        ].join('')
    }
    handleFocus() {
        const focusables = this.focusables();
        if (this.focusedObj == null) {
            const oneWithAutofocusIdx = focusables.findLastIndex((v) => v.attributes.autofocus);

            if (oneWithAutofocusIdx !== -1) this.focusedObj = focusables[oneWithAutofocusIdx];
        }
        if (this.focusedObj) this.focusedObj.focused = true;
    }
    focusDelta(delta: number) {
        const focusables = this.focusables();
        if (this.focusedObj == null) return null;
        let curr = focusables.indexOf(this.focusedObj);
        if (curr === -1) return void (this.focusedObj = null);
        curr += delta;
        curr %= focusables.length;
        curr += focusables.length;
        curr %= focusables.length;
        if (this.focusedObj) this.focusedObj.focused = false;
        this.focusedObj = focusables[curr];
        this.focusedObj.focused = true;
        return this.focusedObj;
    }
    queueImmediateRenderToStream() {
        // its so dirty i love it haha
        if (this.lastImmediate != null) clearImmediate(this.lastImmediate);
        this.lastImmediate = setImmediate(() => {
            this.renderToStream();
            this.lastImmediate = null;
        });
    }
    renderToStream() {
        // this.stream.write('\x0c');
        this.stream.write(this.renderString());
    }
    useKeyboard(callback: (key: string) => void) {
        return React.useEffect(() => {
            this.on('key', (data) => callback(data));
        }, []);
    }
    // sendProtocole(seq: string) {
    //     this.stream.write(`\x1b${['\x39', '\x3A', '\x3B'][seq.length]}${seq}`);
    // }
    // acqCallback(callback = () => {}) {
    //     this.rxQueue.enqueue(callback);
    // }
}
