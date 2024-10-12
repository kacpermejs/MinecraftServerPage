import { DocumentReference, WriteBatch } from '@angular/fire/firestore';
import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { PostContent } from 'app/features/posts/models/PostContent';
import { PostImage } from 'app/features/posts/models/PostImage';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { ImageFileRegisterService } from '../image-file-register/image-file-register.service';

export interface ContentUploadStrategy {
  handle(
    content: PostContent<object>,
    postId: string
  ): Observable<PostContent<object>>;
}

export class DefaultUploadStrategy implements ContentUploadStrategy {
  handle(
    content: PostContent<object>,
    postId: string
  ): Observable<PostContent<object>> {
    return of().pipe(
      map(() => {
        return content;
      })
    );
  }
}

export class ImageUploadStrategy {
  constructor(
    private storage: FirebaseStorage,
    private imageRegister: ImageFileRegisterService
  ) {}

  handle(content: PostImage, postId: string): Observable<PostImage> {
    const fileEntry = content.data.url; // Check the local path
    let file: File | undefined;

    if (fileEntry && fileEntry.startsWith('local:')) {
      const registerId = fileEntry.substring(6); // Extract the register ID
      file = this.imageRegister.getFileById(registerId);
    } else {
      console.error('No valid local path found for the file.');
      return of(content); // Early return if there's no valid file
    }

    if (!file) {
      console.error('File not found for the given register ID.');
      return of(content); // Early return if file retrieval fails
    }

    const contentPath = content.id;
    const storageRef = ref(
      this.storage,
      `posts/${postId}/contents/${contentPath}`
    );

    return new Observable<PostImage>((observer) => {
      uploadBytes(storageRef, file)
        .then(() => {
          // Get the download URL after the upload is complete
          return getDownloadURL(storageRef);
        })
        .then((downloadURL) => {
          // Check if downloadURL is valid
          if (downloadURL) {
            // Update content.data.url with the download URL
            content.data.url = downloadURL;
            observer.next(content); // Emit the modified content
            observer.complete(); // Complete the observable
          } else {
            // Handle the case where downloadURL is invalid
            observer.error(new Error('Download URL is invalid'));
          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          observer.error(error); // Emit error if upload fails
        });
    });
  }
}
