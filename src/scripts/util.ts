export function toArray(o: any) {
	return Object.keys(o).map(k => o[k]);
}

export function reduceReducers(...reducers:Array<(state:any, action:any) => any>) {
  return (state:any, action:any) =>
    reducers.reduce(
      (p, r) => r(p, action),
      state
    );
}

export type FuncOrSelf<T> = T | (() => T);