/// <reference types="node" resolution-mode="require"/>
import { Duplex } from 'stream';
import { Container } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { CharAttributes } from '../types.js';
import { FiberRoot } from 'react-reconciler';
export interface MinitelSettings {
    statusBar: boolean;
}
export declare class Minitel extends Container {
    static defaultScreenAttributes: CharAttributes;
    stream: Duplex;
    previousRender: RichCharGrid;
    _rootContainer?: FiberRoot;
    settings: MinitelSettings;
    constructor(stream: Duplex, settings: Partial<MinitelSettings>);
    renderString(): string;
    renderToStream(): void;
    minitel(): Minitel;
}
