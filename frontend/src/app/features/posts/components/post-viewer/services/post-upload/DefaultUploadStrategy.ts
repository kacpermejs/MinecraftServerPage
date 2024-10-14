import { Observable, of, map } from "rxjs";

import { PostContent } from "app/features/posts/models/PostContent";
import { ContentUploadStrategy } from "./ContentUploadStrategy";

export class DefaultUploadStrategy implements ContentUploadStrategy {
  handle(
    content: PostContent<object>,
    postId: string
  ): Observable<PostContent<object>> {
    return of(void 0).pipe(
      map(() => {
        return content;
      })
    );
  }
}
