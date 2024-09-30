export abstract class PostContent<T = object> {
  abstract type: string;
  order: number = -1;
  id?: string;

  abstract data: T;
}
