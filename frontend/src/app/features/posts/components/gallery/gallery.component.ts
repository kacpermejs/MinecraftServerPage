import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Observable } from 'rxjs';
import { Post } from '../../models/post';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { RouterLink, RouterModule } from '@angular/router';

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

  constructor(private postService: PostService, private authService: AuthService) {
    this.posts$ = this.postService.getPostsOrderedByDate();
    this.uid$ = this.authService.getUserUid();
  }

  ngOnInit(): void {
  }

  addNewPost() {

    this.postService.createNewPost(
      {
        title: "Test",
        description: 'lorem ipsum 1111',
        thumbnailUrl: '/assets/images/sample.png',
        published: false
      } as Post
    ).subscribe(
      console.log
    );
  }

  deletePost(id: string | undefined) {
    if (!id)
      return;

    this.postService.deletePost(id).subscribe();
  }
}
