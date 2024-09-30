export abstract class PostContent<T = object> {
  abstract type: string;
  order: number = -1;
  id?: number;

  abstract data: T;
}
