/// <reference types="react" />
import { FiberRoot } from 'react-reconciler';
import { MinitelObjectAttributes } from 'minitel-standalone/dist/types.js';
import { InputAttributes, Minitel, ScrollableAttributes, XJoinAttributes, YJoinAttributes, ZJoinAttributes } from 'minitel-standalone';
export declare const render: (reactElement: React.ReactNode, rootEl: Minitel, callback?: (() => {})) => () => void;
export declare function useKeyboard(callback: (arg0: string) => any): void;
export { Minitel };
type MiniProps<T> = Partial<T & {
    children: React.ReactNode | React.ReactNode[];
    key: React.Key;
}>;
declare module 'react' {
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
declare module 'minitel-standalone' {
    interface Minitel {
        _rootContainer: FiberRoot;
    }
}
