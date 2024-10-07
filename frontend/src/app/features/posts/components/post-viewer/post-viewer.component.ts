import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Post } from '../../models/post';
import { EditableDirective } from './directives/editable.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { NodeEditorDropdownComponent } from "./components/node-editor-dropdown/node-editor-dropdown.component";
import { PostEditorService } from './services/post-editor.service';
import { PostContentAsParagraphHeaderPipe } from './pipes/post-content-as-paragraph-header.pipe';
import { PostContentAsParagraphPipe } from './pipes/post-content-as-paragraph.pipe';
import { PostContentAsImagePipe } from './pipes/post-content-as-image.pipe';
import { PostParagraphComponent } from './components/post-paragraph/post-paragraph.component';
import { PostParagraphHeaderComponent } from './components/post-paragraph-header/post-paragraph-header.component';
import { PostImageComponent } from './components/post-image/post-image.component';
import { ImageFileInput } from './utils/ImageFileInput';

@Component({
  selector: 'app-post-viewer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EditableDirective,
    DropdownDirective,
    NodeEditorDropdownComponent,
    PostContentAsParagraphHeaderPipe,
    PostContentAsParagraphPipe,
    PostContentAsImagePipe,
    PostParagraphComponent,
    PostParagraphHeaderComponent,
    PostImageComponent
  ],
  templateUrl: './post-viewer.component.html',
  styleUrl: './post-viewer.component.scss',
})
export class PostViewerComponent implements OnInit, ImageFileInput {
  postService = inject(PostService);
  editor = inject(PostEditorService);

  isEditing: boolean = false;

  postId$: Observable<string>;
  post$: Observable<Post | null> = of(null);
  editedPost$: Observable<Post | null> = this.editor.getEditedPost();

  selectedFile: File | null = null;
  downloadURL: string | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.postId$ = this.route.paramMap.pipe(map((params) => params.get('id')!));

    this.post$ = this.postId$.pipe(
      switchMap((id) => this.postService.getPost(id)),
      map((p) => this.reorderContents(p))
    );
  }

  private reorderContents(p: Post) {
    var contents = p?.contents ?? [];
    contents.sort((a, b) => a.order - b.order);

    return {
      ...p,
      contents: contents,
    };
  }

  ngOnInit(): void {
    this.post$.subscribe((post) => {
      console.log('Post:');
      console.log(post);
    });

    this.route.url.subscribe((urlSegments) => {
      const mode = urlSegments[urlSegments.length - 1].path; // Get the last segment to determine 'edit' or 'view'
      console.log('Mode: ' + mode);

      this.isEditing = mode === 'edit';
      if (this.isEditing) {
        this.post$.subscribe((p) => {
          console.log('set');
          console.log(p);

          this.editor.setEditedPost(p);
        });
      }
    });
  }

  // Method to switch between view and edit modes
  toggleEditMode(): void {
    this.postId$.pipe(take(1)).subscribe((id) => {
      if (id) {
        if (this.isEditing) {
          // Navigate to 'view' mode
          this.router.navigate(['/post', id, 'view']);
        } else {
          // Navigate to 'edit' mode
          this.router.navigate(['/post', id, 'edit']);
        }
      }
    });
  }

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

  updatePostContent(order: number, newValue: any) {
    this.editor.updateContentValue(order, newValue);
  }

  updateHeader(data: { title?: string, description?: string }) {
    this.editor.updateHeaderValue(data);
  }

  saveChanges() {
    this.editor.saveChanges().subscribe();
  }
}
