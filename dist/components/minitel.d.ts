/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { Duplex } from 'stream';
import { Container, ContainerAttributes } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { CharAttributes } from '../types.js';
import { FiberRoot } from 'react-reconciler';
import { Focusable } from '../abstract/focusable.js';
export interface MinitelSettings {
    statusBar: boolean;
    localEcho: boolean;
}
export declare class Minitel extends Container<ContainerAttributes, {
    key: [string];
}> {
    static defaultScreenAttributes: CharAttributes;
    stream: Duplex;
    previousRender: RichCharGrid;
    _rootContainer?: FiberRoot;
    settings: MinitelSettings;
    focusedObj: Focusable | null;
    lastImmediate: NodeJS.Immediate | null;
    constructor(stream: Duplex, settings: Partial<MinitelSettings>);
    renderString(): string;
    toCursorMove(y: number, x: number): string;
    handleFocus(): void;
    focusDelta(delta: number): Focusable | null | undefined;
    queueImmediateRenderToStream(): void;
    renderToStream(): void;
    useKeyboard(callback: (key: string) => void): void;
}
