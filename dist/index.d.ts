import { FiberRoot } from 'react-reconciler';
import { DependencyList, RefObject } from 'react';
import { MinitelObjectAttributes } from 'minitel-standalone/dist/types.js';
import { DisplayAttributes, FocusableAttributes, InputAttributes, Minitel, ScrollableAttributes, XJoinAttributes, YJoinAttributes, ZJoinAttributes } from 'minitel-standalone';
import { MinitelObject } from 'minitel-standalone/dist/abstract/minitelobject.js';
declare const minitelContext: import("react").Context<Minitel>;
export declare const render: (reactElement: React.ReactNode, rootEl: Minitel, callback?: (() => {})) => void;
export declare function useKeyboard(callback: (arg0: string) => any, deps?: DependencyList): void;
export { Minitel, minitelContext };
type MiniProps<T> = Partial<T & {
    children: React.ReactNode | React.ReactNode[];
    key: React.Key;
    ref: RefObject<MinitelObject>;
}>;
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'mt-xjoin': MiniProps<XJoinAttributes>;
            'mt-yjoin': MiniProps<YJoinAttributes>;
            'mt-zjoin': MiniProps<ZJoinAttributes>;
            'mt-para': MiniProps<MinitelObjectAttributes>;
            'mt-cont': MiniProps<MinitelObjectAttributes>;
            'mt-disp': MiniProps<DisplayAttributes>;
            'mt-input': MiniProps<InputAttributes>;
            'mt-span': MiniProps<MinitelObjectAttributes>;
            'mt-scroll': MiniProps<ScrollableAttributes>;
            'mt-focus': MiniProps<FocusableAttributes>;
        }
    }
}
declare module 'minitel-standalone' {
    interface Minitel {
        _rootContainer: FiberRoot;
    }
}
