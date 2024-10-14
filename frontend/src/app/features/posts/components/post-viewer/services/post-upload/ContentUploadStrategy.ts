import { PostContent } from 'app/features/posts/models/PostContent';
import { Observable } from 'rxjs';

export interface ContentUploadStrategy {
  handle(
    content: PostContent<object>,
    postId: string
  ): Observable<PostContent<object>>;
}
