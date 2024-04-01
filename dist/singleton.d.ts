export declare class SingletonArray<T> extends Array<T> {
    checkIsSingleton(addedElms: number): void;
    push(...args: T[]): number;
    unshift(...args: T[]): number;
}
