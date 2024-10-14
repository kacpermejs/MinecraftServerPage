import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostImage } from '../../../../models/PostImage';
import { ImageUploadComponent } from '@core/components/image-upload/image-upload.component';
import { ImageFileRegisterService } from '../../services/image-file-register/image-file-register.service';

@Component({
  selector: 'app-post-image',
  standalone: true,
  imports: [CommonModule, EditableDirective, ImageUploadComponent],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.scss'
})
export class PostImageComponent extends BaseNodeComponent<PostImage> {
  
  selectedFile?: File;
  imagePreview?: string | ArrayBuffer;

  private readonly bucketName = 'elmshire-3e15e.appspot.com'; 

  constructor(private imageFileRegister: ImageFileRegisterService) {
    super();
  }

  onFileSelected(event: { file?: File, preview?: string | ArrayBuffer }) {
    this.selectedFile = event.file;
    this.imagePreview = event.preview;

    if(!event.file)
      return;

    const registerId = this.imageFileRegister.registerFile(event.file);

    this.node.data.fileId = "local:" + registerId;

    console.log(`Registered file: ${this.node.data.fileId}`);
  }

  getImageUrl(imageFileId?: string) {
    if (!imageFileId || !this.parentPostId || !this.node.id) {
      return '';
    }

    // Construct the file path with postId, contentId, and imageIdentifier
    const encodedFilePath = encodeURIComponent(`posts/${this.parentPostId}/contents/${this.node.id}/${imageFileId}`);

    // Construct and return the full URL
    return `https://firebasestorage.googleapis.com/v0/b/${this.bucketName}/o/${encodedFilePath}?alt=media`;
  }
}
