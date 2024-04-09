import { Align, FullPadding, MinitelObjectAttributes, Padding } from './types.js';

export const alignInvrt: Record<Align, Align> = {
    start: 'end',
    middle: 'middle',
    end: 'start',
};

export function inheritedProps<T extends MinitelObjectAttributes> (props: Partial<T>): Partial<T> {
    const inheritedProps = ['fillChar', 'fg', 'textAlign', 'bg', 'underline', 'noBlink', 'invert', 'doubleWidth', 'doubleHeight'] as const;
    const result: Partial<T> = {};

    let inheritedProp: keyof MinitelObjectAttributes;
    for (inheritedProp of inheritedProps) {
        // @ts-ignore
        if (inheritedProp in props) result[inheritedProp] = props[inheritedProp];
    }
    return result;
}

export const padding = {
    normalise (pad: Padding): FullPadding {
        let fullPad: FullPadding; // URDL
        if (typeof pad === 'number') {
            fullPad = [pad, pad, pad, pad];
        } else {
            fullPad = [pad[0], pad[1], pad[2] ?? pad[0], pad[3] ?? pad[1]];
        }
        return fullPad;
    },
    exludeX(width: number, pad: FullPadding) {
        width -= pad[1];
        width -= pad[3];
        return width;
    },
    exludeY(height: number, pad: FullPadding) {
        height -= pad[0];
        height -= pad[2];
        return height;
    },
};
