import { InputAttributes, ScrollableAttributes, XJoinAttributes, YJoinAttributes, ZJoinAttributes } from 'minitel-standalone';
import { MinitelObjectAttributes } from 'minitel-standalone/dist/types.js';
import { FiberRoot } from 'react-reconciler';


type MiniProps<T> = Partial<T & { children: React.ReactNode | React.ReactNode[]; key: React.Key }>;

declare module 'minitel-standalone' {
    interface Minitel {
        _rootContainer: FiberRoot;
    }
}

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
