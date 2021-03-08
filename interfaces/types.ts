type Persisted = {
  _id: string;
};

export type MaybePopulated<TUnpopulated, TPopulated> =
  | TUnpopulated
  | TPopulated;

export type Populated<T> = Persisted &
  {
    [K in keyof T]: T[K] extends MaybePopulated<
      infer TUnpopulated,
      infer TPopulated
    >
      ? TPopulated
      : T[K];
  };

export type Unpopulated<T> = {
  [K in keyof T]: T[K] extends MaybePopulated<
    infer TUnpopulated,
    infer TPopulated
  >
    ? TUnpopulated
    : T[K];
};
