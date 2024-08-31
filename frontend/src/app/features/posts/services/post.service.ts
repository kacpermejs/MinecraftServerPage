import { inject, Injectable } from '@angular/core';
import { catchError, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { getMockPosts, Post } from '../models/post';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  authService = inject(AuthService);
  firestore = inject(Firestore);
  postsCollection = collection(this.firestore, 'posts');

  useMock = false;

  posts$: Observable<Post[]>;

  constructor() {

    if (this.useMock) {
      this.posts$ = from([getMockPosts()]).pipe(
        tap((posts) => console.log(posts))
      );
    } else {
      this.posts$ = (
        collectionData(this.postsCollection, { idField: 'id' }) as Observable<
          any[]
        >
      ).pipe(
        tap((posts) => console.log(posts)),
        map((anyPosts) => anyPosts as Post[])
      );
    }
  }

  /**
   * Accesses cached observable of Posts
   * @returns Observable holding array of Posts without contents
   */
  getPosts(): Observable<Post[]> {
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
        const colRef = collection(this.firestore, `posts/${postId}/contents` );
        return collectionData(colRef).pipe(
          map(c => {
            console.log("content:")
            console.log(c)
            return {
              ...p,
              contents: c
            }
          }),
          catchError(err => {
            console.error('Error fetching contents:', err);
            return of({
              ...p,
              contents: []
            });
          })
        );
      }),
      catchError(err => {
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
          return from(
            addDoc(this.postsCollection, {
              ...newPost,
              authorId: uid,
              date: new Date(),
            } as Post)
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
