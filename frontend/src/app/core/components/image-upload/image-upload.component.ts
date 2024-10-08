import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { ImageUploadService } from '@core/services/image-upload/image-upload.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  @Input('initialImage') initialImage: string | ArrayBuffer = '';
  @Output() fileSelected = new EventEmitter<{ file?: File, preview?: string | ArrayBuffer }>();
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile?: File;
  imagePreview?: string | ArrayBuffer;

  constructor(private fileUploadService: ImageUploadService) {
  }

  onFileSelected(event: any) {
    const target = event.target as HTMLInputElement;
    const file: File | null = target.files ? target.files[0] : null;

    console.log('File selected:', file);

    if (file) {
      this.fileUploadService.readFile(file).then((result) => {
        console.log('File read result:', result);

        this.fileSelected.emit({file, preview: result});

        this.imagePreview = result;
      }).catch((error) => {
        console.error('File reading error: ', error);
      });
    } else {
      console.log('No file selected');
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  reset() {
    this.selectedFile = undefined;
    this.imagePreview = undefined;

    this.fileSelected.emit(undefined);
  }
}
