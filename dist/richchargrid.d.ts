import { RichChar } from './richchar.js';
import { Align, CharAttributes, MinitelObjectAttributes } from './types.js';
export declare class RichCharGrid {
    grid: RichChar[][];
    constructor(grid?: RichChar[][]);
    static fromLine(line: string | string[], attributes: Partial<CharAttributes>): RichCharGrid;
    static from(string: string, attributes: MinitelObjectAttributes): RichCharGrid;
    static fill(w: number, h: number, char: RichChar): RichCharGrid;
    get width(): number;
    get height(): number;
    copy(): RichCharGrid;
    copyLine(index: number): RichChar[][];
    copyCol(index: number): RichChar[][];
    cutHeight(height: number, heightAlign: Align): this;
    cutWidth(width: number, widthAlign: Align): this;
    setHeight(height: number, heightAlign: Align, char?: RichChar): this;
    setWidth(width: number, widthAlign: Align, char?: RichChar): this;
    mergeY(operand: RichCharGrid, heightAlign?: string): void;
    mergeX(operand: RichCharGrid, widthAlign?: string): void;
    toString(): string;
}
