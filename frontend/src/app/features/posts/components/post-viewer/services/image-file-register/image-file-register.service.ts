import { Injectable } from '@angular/core';

interface FileRecord {
  id: string;
  file: File;
}

@Injectable({
  providedIn: 'root'
})
export class ImageFileRegisterService {
  private fileMap: Map<string, FileRecord> = new Map();
  private currentId: number = 0;

  constructor() {}

  // Method to register a file and return a unique identifier
  registerFile(file: File): string {
    const registerId = this.generateUniqueId();
    this.fileMap.set(registerId, { id: registerId, file });
    return registerId; // Return the unique identifier
  }

  // Method to retrieve a file by its identifier
  getFileById(registerId: string): File | undefined {
    const fileRecord = this.fileMap.get(registerId);
    return fileRecord?.file; // Return the file or undefined
  }

  // Method to generate a unique ID
  private generateUniqueId(): string {
    return `file_${this.currentId++}`;
  }
}
