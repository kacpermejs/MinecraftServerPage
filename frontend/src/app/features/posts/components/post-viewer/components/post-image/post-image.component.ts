import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostImage } from '../../../../models/PostImage';
import { ImageUploadComponent } from '@core/components/image-upload/image-upload.component';

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

  onFileSelected(event: { file?: File, preview?: string | ArrayBuffer }) {
    this.selectedFile = event.file;
    this.imagePreview = event.preview;
  }
}
