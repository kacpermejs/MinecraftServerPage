import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post, PostContent, PostImage, PostParagraph, PostParagraphHeader } from '../../../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostEditorService {

  private editedPost$ = new BehaviorSubject<Post | null>(null);

  constructor() { }

  public getEditedPost() {
    return this.editedPost$;
  }

  setEditedPost(p: Post | null) {
    this.editedPost$.next(p);
  }

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
