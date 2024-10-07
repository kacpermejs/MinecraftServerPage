import { ElementRef } from "@angular/core";

export interface ImageFileInput {
  selectedFile: File | null;
  downloadURL: string | null;
  imagePreview: string | ArrayBuffer | null;

  fileInput: ElementRef;

  onFileSelected(event: any): void;

  triggerFileInput(): void;
}
