import { InputAttributes } from './components/input.js';
import { ScrollableAttributes } from './components/scrollable.js';
import { XJoinAttributes } from './components/xjoin.js';
import { YJoinAttributes } from './components/yjoin.js';
import { ZJoinAttributes } from './components/zjoin.js';

export interface CharAttributes {
    fg: number;
    bg: number;
    underline: boolean;
    doubleHeight: boolean;
    doubleWidth: boolean;
    noBlink: boolean;
    invert: boolean;
}
export type Align = 'start' | 'middle' | 'end';
export interface MinitelObjectAttributes extends Partial<CharAttributes> {
    fillChar: string;
    width: number | null;
    height: number | null;
    textAlign: Align;
    wrap: 'clip' | 'word-wrap' | 'word-break';
    flexGrow: number | boolean;
    pad: Padding;
}
export interface RenderLinesAttributes extends MinitelObjectAttributes {
    forcedIndent?: number;
}

type MiniProps<T> = Partial<T & { children: React.ReactNode | React.ReactNode[]; key: React.Key }>;

declare module 'react/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            xjoin: MiniProps<XJoinAttributes>;
            yjoin: MiniProps<YJoinAttributes>;
            zjoin: MiniProps<ZJoinAttributes>;
            para: MiniProps<MinitelObjectAttributes>;
            cont: MiniProps<MinitelObjectAttributes>;
            input: MiniProps<InputAttributes>;
            scroll: MiniProps<ScrollableAttributes>;
        }
    }
}

export type FullPadding = [number, number, number, number];
export type Padding = number | [number, number] | FullPadding;
