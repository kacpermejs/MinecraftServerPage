import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  serverTimestamp,
  setDoc,
  WriteBatch,
  writeBatch,
} from '@angular/fire/firestore';
import {
  Observable,
  catchError,
  forkJoin,
  from,
  map,
  mapTo,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Post } from '../../../../models/post';
import { PostContent } from '../../../../models/PostContent';
import { UpdateStrategyRegistry as UploadStrategyRegistry } from './UploadStrategyRegistry';

@Injectable({
  providedIn: 'root',
})
export class PostUploadService {
  firestore = inject(Firestore);
  uploadStrategyRegistry = inject(UploadStrategyRegistry);

  constructor() {}

  savePostWithContents(
    postId: string,
    post: Post,
    changedContents: PostContent[],
    deletedContentIds: string[]
  ): Observable<void> {
    console.log('Saving: ' + postId);
    console.log(post);

    const postDocRef = doc(this.firestore, `posts/${postId}`);

    const batch = writeBatch(this.firestore);

    console.log('before fork join');

    return forkJoin([
      this.updateContent(batch, postId, changedContents), // Updating content
      this.updatePostDocument(batch, postDocRef, post), // Updating post document
      this.deleteContents(batch, postId, deletedContentIds), // Deleting content
    ]).pipe(
      switchMap(() => {
        console.log('All operations done, committing batch.');
        return from(batch.commit());
      }),
      map(() => void 0)
    );
  }

  private updateContent(
    batch: WriteBatch,
    postId: string,
    changedContents: PostContent<object>[]
  ): Observable<void> {
    console.log('content update');

    const observables = changedContents.map((content) => {
      let contentDocRef: DocumentReference = this.getEditedDocumentReference(
        content,
        postId
      );

      return this.uploadStrategyRegistry.handleUpload(content, postId).pipe(
        // Once the upload is complete, save the content node to the batch
        tap((uploadedContent: PostContent<object>) => {
          this.batchSaveContentNode(batch, contentDocRef, uploadedContent);
        })
      );
    });

    // Wait for all uploads and content updates to complete
    return forkJoin(observables).pipe(
      tap(() => {
        console.log('All contents updated.');
      }),
      map(() => void 0)
    );
  }

  private batchSaveContentNode(
    batch: WriteBatch,
    contentDocRef: DocumentReference<DocumentData, DocumentData>,
    uploadedContent: PostContent<object>
  ) {
    console.log('batch set content update');

    batch.set(
      contentDocRef,
      {
        type: uploadedContent.type,
        order: uploadedContent.order,
        data: uploadedContent.data, // Now includes the uploaded URL (if applicable)
      },
      { merge: true }
    );

    console.log(
      uploadedContent.id
        ? `Updating content with ID: ${uploadedContent.id}`
        : `Creating new content`
    );
  }

  private getEditedDocumentReference(
    content: PostContent<object>,
    postId: string
  ) {
    let contentDocRef: DocumentReference;

    if (content.id) {
      // If content has an id, reference that specific document
      contentDocRef = doc(
        this.firestore,
        `posts/${postId}/contents/${content.id}`
      );
    } else {
      // Generate a new document ID by first referencing the collection, then calling doc() to generate an ID
      const contentCollectionRef = collection(
        this.firestore,
        `posts/${postId}/contents`
      );
      contentDocRef = doc(contentCollectionRef); // This auto-generates a new ID
      content.id = contentDocRef.id;
    }
    return contentDocRef;
  }

  private updatePostDocument(
    batch: WriteBatch,
    postDocRef: DocumentReference<DocumentData, DocumentData>,
    post: Post
  ): Observable<void> {
    batch.set(
      postDocRef,
      {
        title: post.title,
        published: post.published,
        description: post.description ?? '',
        thumbnailUrl: post.thumbnailUrl ?? '',
      },
      { merge: true }
    );

    console.log('post update');

    return of(void 0);
  }

  private deleteContents(
    batch: WriteBatch,
    postId: string,
    deletedContentIds: string[]
  ): Observable<void> {
    console.log('content deletion');

    deletedContentIds.forEach((contentId) => {
      const contentDocRef = doc(
        this.firestore,
        `posts/${postId}/contents/${contentId}`
      );
      batch.delete(contentDocRef);
    });

    return of(void 0);
  }
}
