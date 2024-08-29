import { inject, Injectable } from '@angular/core';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { getMockPosts, Post } from '../models/post';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore } from '@angular/fire/firestore';
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
    this.posts$ = (
      collectionData(this.postsCollection, { idField: 'id' }) as Observable<
        any[]
      >
    ).pipe(
      tap((posts) => console.log(posts)),
      map((anyPosts) => anyPosts as Post[])
    );
  }

  getPosts(): Observable<Post[]> {
    if (this.useMock) {
      return from([getMockPosts()]);
    }
    return this.posts$;
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
