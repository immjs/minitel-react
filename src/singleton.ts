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
}
