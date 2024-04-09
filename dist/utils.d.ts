import { Align, FullPadding, MinitelObjectAttributes, Padding } from './types.js';
export declare const alignInvrt: Record<Align, Align>;
export declare function inheritedProps<T extends MinitelObjectAttributes>(props: Partial<T>): Partial<T>;
export declare const padding: {
    normalise(pad: Padding): FullPadding;
    exludeX(width: number, pad: FullPadding): number;
    exludeY(height: number, pad: FullPadding): number;
};
