import { FirebaseStorage, ref, uploadBytes } from "@angular/fire/storage";
import { Observable, of } from "rxjs";

import { PostImage } from "app/features/posts/models/PostImage";
import { ImageFileRegisterService } from "../image-file-register/image-file-register.service";

export class ImageUploadStrategy {
  constructor(
    private storage: FirebaseStorage,
    private imageRegister: ImageFileRegisterService
  ) { }

  handle(content: PostImage, postId: string): Observable<PostImage> {
    const fileEntry = content.data.fileId; // Check the local path
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

    const fileIdentifier = `single_image`;
    const storageRef = ref(
      this.storage,
      `posts/${postId}/contents/${content.id}/${fileIdentifier}`
    );

    return new Observable<PostImage>((observer) => {
      uploadBytes(storageRef, file)
        .then(() => {
          content.data.fileId = fileIdentifier;
          observer.next(content); // Emit the modified content
          observer.complete(); // Complete the observable
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          observer.error(error); // Emit error if upload fails
        });
    });
  }
}
