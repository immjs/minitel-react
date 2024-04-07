import { Align, MinitelObjectAttributes } from './types.js';

export const alignInvrt: Record<Align, Align> = {
    start: 'end',
    middle: 'middle',
    end: 'start',
};

export function inheritedProps (props: Partial<MinitelObjectAttributes>) {
    const inheritedProps = ['fillChar', 'fg', 'bg', 'underline', 'noBlink', 'invert', 'doubleWidth', 'doubleHeight'] as const;
    const result: Partial<MinitelObjectAttributes> = {};

    let inheritedProp: keyof MinitelObjectAttributes;
    for (inheritedProp of inheritedProps) {
        // @ts-ignore
        if (inheritedProp in props) result[inheritedProp] = props[inheritedProp];
    }
    return result;
}
