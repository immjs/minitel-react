/// <reference types="node" resolution-mode="require"/>
import { Duplex } from 'stream';
import { Container } from './container.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { FiberRoot } from 'react-reconciler';
export declare class Minitel extends Container {
    stream: Duplex;
    previousRender: RichCharGrid;
    _rootContainer?: FiberRoot;
    constructor(stream: Duplex, attributes?: Partial<MinitelObjectAttributes>);
    renderString(): string;
    renderToStream(): void;
    minitel(): Minitel;
}
