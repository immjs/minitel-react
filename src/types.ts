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
    widthAlign: Align;
    heightAlign: Align;
    width: number | null;
    height: number | null;
    wrap: 'clip' | 'word-wrap' | 'word-break';
    gap: number | 'space-between' | 'space-around' | 'space-evenly';
}
export interface RenderLinesAttributes extends MinitelObjectAttributes {
    forcedIndent?: number;
}

type MiniProps = Partial<MinitelObjectAttributes & { children: React.ReactNode | React.ReactNode[] }>;
type MiniElements = 'yjoin' | 'xjoin' | 'para';
type MiniElementsWithProps = Record<MiniElements, MiniProps>;

declare module "react/jsx-runtime" {
    namespace JSX {
        interface IntrinsicElements extends MiniElementsWithProps {}
    }
}
