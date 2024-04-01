export class SingletonArray extends Array {
    checkIsSingleton(addedElms) {
        if (this.length + addedElms > 1)
            throw new Error('SingletonArray only allows a maximum of one element');
    }
    push(...args) {
        this.checkIsSingleton(args.length);
        return super.push(...args);
    }
    unshift(...args) {
        this.checkIsSingleton(args.length);
        return super.unshift(...args);
    }
}
