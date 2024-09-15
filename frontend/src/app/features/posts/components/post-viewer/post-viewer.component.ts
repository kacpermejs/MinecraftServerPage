import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Post, PostContent, PostImage, PostParagraph, PostParagraphHeader } from '../../models/post';
import { EditableDirective } from './directives/editable.directive';

@Component({
  selector: 'app-post-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule, EditableDirective],
  templateUrl: './post-viewer.component.html',
  styleUrl: './post-viewer.component.scss'
})
export class PostViewerComponent implements OnInit {
  postService = inject(PostService);

  isEditing: boolean = false;
  dropdownOpenIndex: number | null = null;

  postId$: Observable<string>;
  post$: Observable<Post | null> = of(null);
  editedPost$ = new BehaviorSubject<Post | null>(null);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.postId$ = this.route.paramMap.pipe(
      map(params => params.get('id')!)
    );

    this.post$ = this.postId$.pipe(
      switchMap(id => this.postService.getPost(id)),
      map(p => this.reorderContents(p))
    );

  }

  private reorderContents(p: Post) {
    var contents = p?.contents ?? [];
    contents.sort((a, b) => a.order - b.order);

    return {
      ...p,
      contents: contents
    };
  }

  castAsPostText(content: PostContent) {
    return content as PostParagraph;
  }

  castAsPostParagraphHeader(content: PostContent) {
    return content as PostParagraph;
  }

  castAsPostImage(content: PostContent) {
    return content as PostImage;
  }
  
  ngOnInit(): void {
    this.post$.subscribe(post => {
      console.log("Post:");
      console.log(post);
    });

    this.route.url.subscribe(urlSegments => {
      const mode = urlSegments[urlSegments.length - 1].path; // Get the last segment to determine 'edit' or 'view'
      console.log("Mode: " + mode);
      
      this.isEditing = (mode === 'edit');
      if (this.isEditing) {
        this.post$.subscribe(p => {
          this.editedPost$.next(p);
        })
      }
    });
  }

  // Method to switch between view and edit modes
  toggleEditMode(): void {

    this.postId$.pipe(take(1)).subscribe( id => {
      if (id) {
        if (this.isEditing) {
          // Navigate to 'view' mode
          this.router.navigate(['/post', id, 'view']);
        } else {
          // Navigate to 'edit' mode
          this.router.navigate(['/post', id, 'edit']);
        }
      }
    })
  }

  //==================
  // Dropdown
  //==================

  // Toggle dropdown for a specific post
  toggleDropdown(index: number, event: MouseEvent) {
    event.stopPropagation(); // Prevent click event from propagating and immediately closing the dropdown
    if (this.dropdownOpenIndex === index) {
      this.dropdownOpenIndex = null; // Close the dropdown if clicked again
    } else {
      this.dropdownOpenIndex = index; // Open the dropdown for the current post
    }
  }

  resetDropdown() {
    this.dropdownOpenIndex = null;
  }

  // Check if dropdown is open for a particular index
  isDropdownOpen(index: number): boolean {
    return this.dropdownOpenIndex === index;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.dropdownOpenIndex = null;
  }

  //==================
  //editor options
  //==================

  addEmptyElement(index: number, createContent: () => PostContent) {
    const content = createContent();
    var post = this.editedPost$.value;
  
    if (post == null)
      return;
    if (!post.contents)
      post.contents = [];

    index +=1;
    content.order = index;
    post.contents.splice(index, 0, content);

    for (let id = 0; id < post.contents.length; id++) {
      post.contents[id].order = id;
    }

    this.resetDropdown();
  }

  addHeaderAfter(index: number) {
    this.addEmptyElement(index, () => new PostParagraphHeader());
  }

  addParagraphAfter(index: number) {
    this.addEmptyElement(index, () => new PostParagraph());
  }

  addImageAfter(index: number) {
    this.addEmptyElement(index, () => new PostImage());
  }
}
