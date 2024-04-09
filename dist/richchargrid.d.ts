import { LocationDescriptors } from './locationdescriptor.js';
import { RichChar } from './richchar.js';
import { Align, CharAttributes, FullPadding } from './types.js';
export declare class RichCharGrid {
    grid: RichChar[][];
    locationDescriptors: LocationDescriptors;
    _width: number;
    constructor(grid?: RichChar[][]);
    mostCommonAttribute(attribute: 'fg' | 'invert' | 'noBlink'): any;
    static fromLine(line: string | string[], attributes: Partial<CharAttributes>): RichCharGrid;
    static fill(w: number, h: number, char: RichChar): RichCharGrid;
    get width(): number;
    get height(): number;
    copy(): RichCharGrid;
    copyLine(index: number): RichChar[][];
    copyCol(index: number): RichChar[][];
    pad(fullPad: FullPadding, fillChar: RichChar): this;
    cutHeight(height: number, heightAlign: Align): this;
    cutWidth(width: number, widthAlign: Align): this;
    setHeight(height: number, heightAlign: Align, char?: RichChar): this;
    setWidth(width: number, widthAlign: Align, char?: RichChar): this;
    mergeLocationDescriptors(operand: RichCharGrid): void;
    mergeY(operand: RichCharGrid, heightAlign?: string): void;
    mergeX(operand: RichCharGrid, widthAlign?: string): void;
    toString(): string;
}
