import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../models/post';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  posts$: Observable<Post[] | undefined>;
  uid$: Observable<string>;

  router = inject(Router);
  postService = inject(PostService);
  authService = inject(AuthService);

  constructor() {
    this.posts$ = this.postService.getPostsOrderedByDate();
    this.uid$ = this.authService.getUserUid();
  }

  ngOnInit(): void {
  }

  addNewPost() {

    this.postService.createNewPost(
      {
        title: 'Untitled',
        published: false
      } as Post
    ).subscribe( id => {
      console.log(id);
      this.router.navigate(['post', id, 'edit'])
    }
    );
  }

  deletePost(id: string | undefined) {
    if (!id)
      return;

    this.postService.deletePost(id).subscribe();
  }
}
