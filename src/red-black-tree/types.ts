export type Color = 'red' | 'black';

export type Node<T> = {
  value: T;
  parent?: Node<T>;
  left?: Node<T>;
  right?: Node<T>;
  color: Color;
}

export interface Tree<T> {
  append(value: T): void;
}
