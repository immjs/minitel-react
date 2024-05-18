import { Minitel } from 'minitel-standalone';
export declare const render: (reactElement: React.ReactNode, rootEl: Minitel, callback?: (() => {})) => () => void;
export declare function useKeyboard(callback: (arg0: string) => any): void;
export { Minitel };
