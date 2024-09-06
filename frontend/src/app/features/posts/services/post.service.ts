import { inject, Injectable } from '@angular/core';
import {
  catchError,
  combineLatest,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { getMockPosts, Post } from '../models/post';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from '@angular/fire/firestore';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  authService = inject(AuthService);
  firestore = inject(Firestore);
  postsCollection = collection(this.firestore, 'posts');
  orderedPostsQuery = query(
    this.postsCollection,
    where('published', '==', true),
    orderBy('date', 'desc')
  );

  useMock = false;

  posts$: Observable<Post[]>;

  constructor() {
    if (this.useMock) {
      this.posts$ = from([getMockPosts()]).pipe(
        tap((posts) => console.log(posts))
      );
    } else {
      this.posts$ = combineLatest([
        collectionData(this.orderedPostsQuery, { idField: 'id' }) as Observable<
          Post[]
        >,
        this.getUsersPosts(),
      ]).pipe(
        map(([publishedPosts, userPosts]) => {
          const mergedPosts = [...publishedPosts, ...userPosts];
          const uniquePosts = Array.from(
            new Map(mergedPosts.map((post) => [post.id, post])).values()
          );

          const sortedPosts = uniquePosts.sort((a, b) => {
            // Handle different types for date comparison
            const dateA = this.getPostDate(a);
            const dateB = this.getPostDate(b);
            return dateB - dateA; // Sort in descending order (latest posts first)
          });

          return sortedPosts;
        }),
        tap((posts) => console.log(posts))
      );
    }
  }

  private getPostDate(post: Post): number {
    if (post.date instanceof Date) {
      return post.date.getTime();
    } else if (post.date && typeof post.date.toDate === 'function') {
      return post.date.toDate().getTime();
    } else {
      // Date is unresolved (e.g., serverTimestamp placeholder)
      return Date.now();
    }
  }

  getUsersPosts(): Observable<Post[]> {
    return this.authService.getUserUid().pipe(
      switchMap((uid) => {
        if (uid > '') {
          const usersPostQuery = query(
            this.postsCollection,
            where('authorId', '==', uid),
            orderBy('date', 'desc')
          );

          return collectionData(usersPostQuery, {
            idField: 'id',
          }) as Observable<Post[]>;
        } else {
          console.log('User not logged in. Skipping owned posts.');
          return of([]);
        }
      })
    );
  }

  /**
   * Accesses cached observable of Posts
   * @returns Observable holding array of Posts without contents
   */
  getPostsOrderedByDate(): Observable<Post[]> {
    return this.posts$;
  }

  /**
   * Gets whole Post with its /contents subcollection
   * @param postId
   * @returns Observable of single Post with contents filled
   */
  getPost(postId: string): Observable<Post> {
    console.log('getting post');
    const postDocRef = doc(this.firestore, `posts/${postId}`);

    return docData<Post>(postDocRef).pipe(
      mergeMap((p: Post) => {
        const colRef = collection(this.firestore, `posts/${postId}/contents`);
        return collectionData(colRef).pipe(
          map((c) => {
            console.log('content:');
            console.log(c);
            return {
              ...p,
              contents: c,
            };
          }),
          catchError((err) => {
            console.error('Error fetching contents:', err);
            return of({
              ...p,
              contents: [],
            });
          })
        );
      }),
      catchError((err) => {
        console.error('Error fetching post:', err);
        return of(null);
      })
    );
  }

  createNewPost(newPost: Post) {
    return this.authService.getAuthState().pipe(
      switchMap((user) => {
        if (user) {
          const uid = user.uid;

          const post = {
            ...newPost,
            authorId: uid,
            published: false,
            date: serverTimestamp(),
          } as Post;

          console.log("New post added:");
          console.log(post);
          
          return from(
            addDoc(this.postsCollection, post)
          ).pipe(
            switchMap((docRef) => {
              return from(Promise.resolve(docRef.id));
            })
          );
        } else {
          console.error('User not authenticated');
          return from(Promise.reject('User not authenticated'));
        }
      })
    );
  }

  deletePost(postId: string): Observable<void> {
    const docRef = doc(this.firestore, 'posts/' + postId);
    const promise = deleteDoc(docRef);
    return from(promise);
  }
}
