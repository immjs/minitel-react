export declare class SingletonArray<T> extends Array<T> {
    checkIsSingleton(addedElms: number): void;
    push(...args: T[]): number;
    unshift(...args: T[]): number;
    flatMap<U, This = Array<T>>(callback: (this: This, value: T, index: number, array: T[]) => U | readonly U[], thisArg?: This | undefined): U[];
}
