import { inject, Injectable } from '@angular/core';
import { collection, doc, DocumentData, DocumentReference, Firestore, serverTimestamp, setDoc, WriteBatch, writeBatch } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { Post } from '../../../models/post';
import { PostContent } from '../../../models/PostContent';

@Injectable({
  providedIn: 'root'
})
export class PostUploadService {
  firestore = inject(Firestore);

  constructor() { }

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

    this.updatePostDocument(batch, postDocRef, post);
    this.updateContent(batch, postId, changedContents);
    this.deleteContents(batch, postId, deletedContentIds);

    // Commit the batch write as an observable
    return from(batch.commit());
  }

  private deleteContents(batch: WriteBatch, postId: string, deletedContentIds: string[]) {
    deletedContentIds.forEach(contentId => {
      const contentDocRef = doc(this.firestore, `posts/${postId}/contents/${contentId}`);
      batch.delete(contentDocRef);
    });
  }

  private updateContent(batch: WriteBatch, postId: string, changedContents: PostContent<object>[]) {
    changedContents.forEach((content) => {
      let contentDocRef;

      if (content.id) {
        // If content has an id, reference that specific document
        contentDocRef = doc(this.firestore, `posts/${postId}/contents/${content.id}`);
      } else {
        // Generate a new document ID by first referencing the collection, then calling doc() to generate an ID
        const contentCollectionRef = collection(this.firestore, `posts/${postId}/contents`);
        contentDocRef = doc(contentCollectionRef); // This auto-generates a new ID
      }

      // Use set with merge to update the content document
      batch.set(contentDocRef, {
        type: content.type,
        order: content.order,
        data: content.data,
      }, { merge: true });

      console.log(content.id ? `Updating content with ID: ${content.id}` : `Creating new content`);
    });
  }

  private updatePostDocument(batch: WriteBatch, postDocRef: DocumentReference<DocumentData, DocumentData>, post: Post) {
    batch.set(postDocRef, {
      title: post.title,
      published: post.published,
      description: post.description ?? '',
      thumbnailUrl: post.thumbnailUrl ?? '',
    }, { merge: true });
  }
}
