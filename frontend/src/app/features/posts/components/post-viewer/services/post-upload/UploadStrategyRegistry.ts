import { getStorage } from "@angular/fire/storage";
import { ContentUploadStrategy, DefaultUploadStrategy, ImageUploadStrategy } from "./ContentUploadStrategy";
import { Observable } from "rxjs";
import { PostContent } from "app/features/posts/models/PostContent";
import { inject, Injectable } from "@angular/core";
import { FirebaseApp } from "@angular/fire/app";
import { ImageFileRegisterService } from "../image-file-register/image-file-register.service";

@Injectable({
  providedIn: 'root'
})
export class UpdateStrategyRegistry {
  private strategyMap: { [key: string]: ContentUploadStrategy };

  app = inject(FirebaseApp);
  storage = getStorage(this.app);
  imageRegister = inject(ImageFileRegisterService);

  constructor() {
    this.strategyMap = {
      'image': new ImageUploadStrategy(this.storage, this.imageRegister),
    };
  }

  handleUpload(content: PostContent<object>, postId: string): Observable<PostContent<object>> {
    let handler = this.strategyMap[content.type];

    if (!handler) {
      handler = new DefaultUploadStrategy();
    }

    return handler.handle(content, postId);
  }
}
