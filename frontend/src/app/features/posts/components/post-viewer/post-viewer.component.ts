import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { catchError, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Post, PostContent, PostImage, PostParagraph } from '../../models/post';

@Component({
  selector: 'app-post-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-viewer.component.html',
  styleUrl: './post-viewer.component.scss'
})
export class PostViewerComponent implements OnInit {
  postService = inject(PostService);

  isEditing: boolean = false;

  postId$: Observable<string>;
  post$: Observable<Post | null> = of(null);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.postId$ = this.route.paramMap.pipe(
      map(params => params.get('id')!)
    );

    this.post$ = this.postId$.pipe(
      switchMap(id => this.postService.getPost(id))
    );

  }

  addContentElement() {

  }

  castAsPostText(content: PostContent) {
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
      this.isEditing = (mode === 'edit');
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
}
