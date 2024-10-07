import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseNodeComponent } from '../base-node.component';
import { EditableDirective } from '../../directives/editable.directive';
import { PostImage } from '../../../../models/PostImage';
import { ImageFileInput } from '../../utils/ImageFileInput';

@Component({
  selector: 'app-post-image',
  standalone: true,
  imports: [CommonModule, EditableDirective],
  templateUrl: './post-image.component.html',
  styleUrl: './post-image.component.scss'
})
export class PostImageComponent extends BaseNodeComponent<PostImage> implements ImageFileInput {

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
}
