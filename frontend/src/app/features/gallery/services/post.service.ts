import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { getMockPosts, Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts$ = new BehaviorSubject<Post[] | undefined>(undefined);

  constructor(private http: HttpClient) {
    this.posts$.next(getMockPosts());
  }

  getPosts(): Observable<Post[] | undefined> {
    return this.posts$;
  }


}
