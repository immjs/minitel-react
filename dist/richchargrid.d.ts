import { LocationDescriptors } from './locationdescriptor.js';
import { RichChar } from './richchar.js';
import { Align, CharAttributes, FullPadding } from './types.js';
export declare class RichCharGrid {
    grid: (RichChar<string> | RichChar<null>)[][];
    locationDescriptors: LocationDescriptors;
    _width: number;
    constructor(grid?: (RichChar<string> | RichChar<null>)[][]);
    mostCommonAttribute(attribute: 'fg' | 'invert' | 'noBlink'): any;
    static fromLine(line: string | string[], attributes: Partial<CharAttributes>): RichCharGrid;
    static fill(w: number, h: number, char: RichChar<string>): RichCharGrid;
    get width(): number;
    get height(): number;
    copy(): RichCharGrid;
    copyLine(index: number): (RichChar<string> | RichChar<null>)[][];
    copyCol(index: number): (RichChar<string> | RichChar<null>)[][];
    pad(fullPad: FullPadding, fillChar: RichChar<string>): this;
    cutHeight(height: number, heightAlign: Align): this;
    cutWidth(width: number, widthAlign: Align): this;
    setHeight(height: number, heightAlign: Align, char?: RichChar<string>): this;
    setWidth(width: number, widthAlign: Align, char?: RichChar<string>): this;
    mergeLocationDescriptors(operand: RichCharGrid): void;
    mergeY(operand: RichCharGrid, heightAlign?: string): void;
    mergeX(operand: RichCharGrid, widthAlign?: string): void;
    toString(): string;
}
