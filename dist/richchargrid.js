import { LocationDescriptors } from './locationdescriptor.js';
import { RichChar } from './richchar.js';
export class RichCharGrid {
    constructor(grid = []) {
        this._width = 0;
        this.grid = grid;
        this.locationDescriptors = new LocationDescriptors();
        this.width; // run check on getter
    }
    mostCommonAttribute(attribute) {
        const results = new Map();
        for (const line of this.grid) {
            for (const char of line) {
                const value = char.attributes[attribute];
                results.set(value, (results.get(value) || 0) + 1);
            }
        }
        let maxCount = -Infinity;
        let maxValue = null;
        for (let [value, count] of results.entries()) {
            if (count > maxCount) {
                maxValue = value;
                maxCount = count;
            }
        }
        return maxValue;
    }
    static fromLine(line, attributes) {
        const result = new RichCharGrid([[]]);
        const allNewChars = [];
        for (let char of line) {
            const newChar = new RichChar(char, attributes);
            allNewChars.push(newChar);
            const emptyCodepdChar = new RichChar(null, attributes, [0, -1], newChar).noSize();
            result.mergeX(new RichCharGrid(attributes.doubleWidth
                ? [[newChar, emptyCodepdChar]]
                : [[newChar]]));
        }
        if (attributes.doubleHeight) {
            const newLine = new RichCharGrid([[]]);
            for (let newChar of allNewChars) {
                newLine.mergeX(new RichCharGrid([
                    [new RichChar(null, Object.assign({}, attributes), [1, 0], newChar).noSize()]
                ]));
                if (attributes.doubleWidth) {
                    newLine.mergeX(new RichCharGrid([
                        [new RichChar(null, Object.assign({}, attributes), [1, -1], newChar).noSize()]
                    ]));
                }
            }
            result.mergeY(newLine, 'start');
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
    pad(fullPad, fillChar) {
        const safeFillChar = fillChar.noSize();
        this.setHeight(this.height + fullPad[0], 'start', safeFillChar);
        this.setWidth(this.width + fullPad[1], 'end', safeFillChar);
        this.setHeight(this.height + fullPad[2], 'end', safeFillChar);
        this.setWidth(this.width + fullPad[3], 'start', safeFillChar);
        return this;
    }
    cutHeight(height, heightAlign) {
        const prevHeight = this.height;
        const cutAmount = prevHeight - height;
        switch (heightAlign) {
            case 'start':
            case 'end':
                const cutStart = { start: 0, end: height }[heightAlign];
                if (heightAlign === 'start')
                    this.locationDescriptors.applyDelta(-cutAmount, 0);
                this.grid.splice(cutStart, cutAmount);
                this.locationDescriptors.cut(this.height, this.width);
                return this;
            case 'middle':
                const topToMiddle = Math.floor(cutAmount / 2);
                this.cutHeight(prevHeight - topToMiddle, 'start');
                this.cutHeight(height, 'end');
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
                if (widthAlign === 'start')
                    this.locationDescriptors.applyDelta(0, -cutAmount);
                this.grid.forEach((line) => line.splice(cutStart, cutAmount));
                this.locationDescriptors.cut(this.height, this.width);
                return this;
            case 'middle':
                const leftToMiddle = Math.floor(cutAmount / 2);
                this.cutWidth(prevWidth - leftToMiddle, 'start');
                this.cutWidth(width, 'end');
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
    mergeLocationDescriptors(operand) {
        // console.log('MergePropertyDescriptors', this.locationDescriptors, operand.locationDescriptors);
        if (!operand.locationDescriptors.isEmpty)
            this.locationDescriptors.merge(operand.locationDescriptors);
    }
    mergeY(operand, heightAlign = 'end') {
        if (operand.height === 0)
            return;
        if (operand.width !== this.width && this.height !== 0 && operand.height !== 0) {
            throw new Error('Width is not shared between the two operands');
        }
        const prevHeight = this.height;
        switch (heightAlign) {
            case 'start':
                for (let lineIdx in operand.grid) {
                    this.grid.unshift(...operand.copyLine(+lineIdx));
                }
                this.locationDescriptors.applyDelta(operand.height, 0);
                break;
            case 'end':
                for (let lineIdx in operand.grid) {
                    this.grid.push(...operand.copyLine(+lineIdx));
                }
                operand.locationDescriptors.applyDelta(prevHeight, 0);
                break;
        }
        this.mergeLocationDescriptors(operand);
    }
    mergeX(operand, widthAlign = 'end') {
        if (operand.width === 0)
            return;
        if (operand.height !== this.height && this.width !== 0 && operand.height !== 0) {
            throw new Error('Height is not shared between the two operands');
        }
        const prevWidth = this.width;
        switch (widthAlign) {
            case 'start':
                for (let colIdx in operand.grid[0]) {
                    operand.copyCol(+colIdx).forEach((line, idx) => {
                        if (!(idx in this.grid))
                            this.grid[idx] = [];
                        this.grid[idx].unshift(...line);
                    });
                }
                this.locationDescriptors.applyDelta(0, operand.width);
                break;
            case 'end':
                for (let colIdx in operand.grid[0]) {
                    operand.copyCol(+colIdx).forEach((line, idx) => {
                        if (!(idx in this.grid))
                            this.grid[idx] = [];
                        this.grid[idx].push(...line);
                    });
                }
                operand.locationDescriptors.applyDelta(0, prevWidth);
                break;
        }
        this.mergeLocationDescriptors(operand);
    }
    toString() {
        return `=====RICHCHARGRID=====
Width: ${this.width}
Height: ${this.height}
${this.grid.map((line) => `|${line.map(({ char }) => char === '' ? '_' : char).join('')}/`).join('\n')}
=====END RICHCHARGRID=====`;
    }
}
