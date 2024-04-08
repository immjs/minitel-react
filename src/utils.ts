import { Align, MinitelObjectAttributes } from './types.js';

export const alignInvrt: Record<Align, Align> = {
    start: 'end',
    middle: 'middle',
    end: 'start',
};

export function inheritedProps (props: Record<string, any>) {
    const inheritedProps = ['fillChar', 'fg', 'textAlign', 'bg', 'underline', 'noBlink', 'invert', 'doubleWidth', 'doubleHeight'] as const;
    const result: Partial<MinitelObjectAttributes> = {};

    let inheritedProp: keyof MinitelObjectAttributes;
    for (inheritedProp of inheritedProps) {
        // @ts-ignore
        if (inheritedProp in props) result[inheritedProp] = props[inheritedProp];
    }
    return result;
}
