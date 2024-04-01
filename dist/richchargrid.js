import { RichChar } from './richchar.js';
export class RichCharGrid {
    constructor(grid = []) {
        this.grid = grid;
        this.width;
    }
    static fromLine(line, attributes) {
        const result = new RichCharGrid([[]]);
        for (let char of line) {
            result.mergeX(new RichCharGrid([[new RichChar(char, attributes)]]));
        }
        return result;
    }
    static from(string, attributes) {
        const result = new RichCharGrid();
        const lines = string.split(/\r?\n/g);
        const width = Math.max(...lines.map((v) => v.length));
        const fillChar = new RichChar(attributes.fillChar, attributes);
        for (let line of lines) {
            result.mergeY(RichCharGrid.fromLine(line, attributes).setWidth(width, attributes.widthAlign, fillChar));
        }
        return result;
    }
    static fill(w, h, char) {
        const newGrid = [];
        for (let y = 0; y < h; y += 1) {
            const currGrid = [];
            for (let x = 0; x < w; x += 1) {
                currGrid.push(char.copy());
            }
            newGrid.push(currGrid);
        }
        return new RichCharGrid(newGrid);
    }
    get width() {
        if (this.grid.length === 0)
            return 0;
        if (this.grid.some((v) => v.length !== this.grid[0].length))
            throw new Error('RichCharGrid expects a proper rectangle');
        return this.grid[0].length;
    }
    get height() {
        return this.grid.length;
    }
    copy() {
        return new RichCharGrid(this.grid.map((line) => line.map((char) => char.copy())));
    }
    copyLine(index) {
        return [this.grid[index].map((char) => char.copy())];
    }
    copyCol(index) {
        return this.grid.map((char) => [char[index].copy()]);
    }
    cutHeight(height, heightAlign) {
        const cutAmount = this.height - height;
        switch (heightAlign) {
            case 'start':
            case 'end':
                const cutStart = { start: 0, end: height }[heightAlign];
                this.grid.splice(cutStart, cutAmount);
                return this;
            case 'middle':
                const topToMiddle = Math.floor(cutAmount / 2);
                const middleToBottom = cutAmount - topToMiddle;
                this.cutHeight(topToMiddle, 'start');
                this.cutHeight(middleToBottom, 'end');
                return this;
        }
    }
    cutWidth(width, widthAlign) {
        const prevWidth = this.width;
        const cutAmount = prevWidth - width;
        switch (widthAlign) {
            case 'start':
            case 'end':
                const cutStart = { start: 0, end: width }[widthAlign];
                this.grid.forEach((line) => line.splice(cutStart, cutAmount));
                return this;
            case 'middle':
                const leftToMiddle = Math.floor(cutAmount / 2);
                const middleToRight = cutAmount - leftToMiddle;
                this.cutWidth(prevWidth - leftToMiddle, 'start');
                this.cutWidth(prevWidth - middleToRight, 'end');
                return this;
        }
    }
    setHeight(height, heightAlign, char = new RichChar(' ')) {
        if (this.height === height)
            return this;
        if (this.height > height)
            return this.cutHeight(height, heightAlign);
        const addAmount = height - this.height;
        switch (heightAlign) {
            case 'start':
            case 'end':
                const newBlock = RichCharGrid.fill(this.width, addAmount, char);
                this.mergeY(newBlock, heightAlign);
                return this;
            case 'middle':
                const topToMiddle = Math.floor(addAmount / 2);
                this.setHeight(this.height + topToMiddle, 'start', char);
                const middleToBottom = addAmount - topToMiddle;
                this.setHeight(this.height + middleToBottom, 'end', char);
                return this;
        }
    }
    setWidth(width, widthAlign, char = new RichChar(' ')) {
        if (this.width === width)
            return this;
        if (this.width > width)
            return this.cutWidth(width, widthAlign);
        const addAmount = width - this.width;
        switch (widthAlign) {
            case 'start':
            case 'end':
                const newBlock = RichCharGrid.fill(addAmount, this.height, char);
                this.mergeX(newBlock, widthAlign);
                return this;
            case 'middle':
                const leftToMiddle = Math.floor(addAmount / 2);
                this.setWidth(this.width + leftToMiddle, 'start', char);
                const middleToRight = addAmount - leftToMiddle;
                this.setWidth(this.width + middleToRight, 'end', char);
                return this;
        }
    }
    mergeY(operand, heightAlign = 'end') {
        if (operand.height === 0)
            return;
        if (operand.width !== this.width && this.height !== 0) {
            throw new Error('Width is not shared between the two operands');
        }
        switch (heightAlign) {
            case 'start':
                for (let lineIdx in operand.grid) {
                    this.grid.unshift(...operand.copyLine(+lineIdx));
                }
                break;
            case 'end':
                for (let lineIdx in operand.grid) {
                    this.grid.push(...operand.copyLine(+lineIdx));
                }
                break;
        }
    }
    mergeX(operand, widthAlign = 'end') {
        if (operand.width === 0)
            return;
        if (operand.height !== this.height && this.width !== 0) {
            throw new Error('Height is not shared between the two operands');
        }
        switch (widthAlign) {
            case 'start':
                for (let colIdx in operand.grid[0]) {
                    operand.copyCol(+colIdx).forEach((line, idx) => {
                        if (!(idx in this.grid))
                            this.grid[idx] = [];
                        this.grid[idx].unshift(...line);
                    });
                }
                break;
            case 'end':
                for (let colIdx in operand.grid[0]) {
                    operand.copyCol(+colIdx).forEach((line, idx) => {
                        if (!(idx in this.grid))
                            this.grid[idx] = [];
                        this.grid[idx].push(...line);
                    });
                }
                break;
        }
    }
    toString() {
        return `=====RICHCHARGRID=====
Width: ${this.width}
Height: ${this.height}
${this.grid.map((line) => line.map(({ char }) => char).join('')).join('\n')}
=====END RICHCHARGRID=====`;
    }
}
