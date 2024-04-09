export class SingletonArray<T> extends Array<T> {
    checkIsSingleton(addedElms: number) {
        if (this.length + addedElms > 1) throw new Error('SingletonArray only allows a maximum of one element');
    }
    push(...args: T[]) {
        this.checkIsSingleton(args.length);
        return super.push(...args);
    }
    unshift(...args: T[]) {
        this.checkIsSingleton(args.length);
        return super.unshift(...args);
    }
    flatMap<U, This = Array<T>>(callback: (this: This, value: T, index: number, array: T[]) => U | readonly U[], thisArg?: This | undefined): U[] {
        if (this.length < 1) return []
        return [this[0]].flatMap(callback);
    }
}
