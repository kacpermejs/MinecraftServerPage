import { Component, OnInit } from '@angular/core';
import { PostService } from './services/post.service';
import { Observable } from 'rxjs';
import { Post } from './models/post';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  posts$: Observable<Post[] | undefined>;

  constructor(private postService: PostService) {
    this.posts$ = this.postService.getPosts();
  }

  ngOnInit(): void {
    
  }
}
