import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';

import { Post } from '../../../models/post';
import { PostContent } from '../../../models/PostContent';
import { PostContentPlaceholder } from '../../../models/PostContentPlaceholder';
import { PostParagraphHeader } from '../../../models/PostParagraphHeader';
import { PostParagraph } from '../../../models/PostParagraph';
import { PostImage } from '../../../models/PostImage';

@Injectable({
  providedIn: 'root'
})
export class PostEditorService {
  private toAddOrUpdate: PostContent[] = [];
  private toDelete: number[] = [];

  private originalPost?: Post;
  private editedPost$ = new BehaviorSubject<Post | null>(null);

  constructor() { }

  public getEditedPost() {
    return this.editedPost$;
  }

  setEditedPost(p: Post | null) {
    if (p) {
      this.originalPost = cloneDeep(p);

      this.editedPost$.next(p);
    } else {
      this.originalPost = undefined;
      this.editedPost$.next(null);
    }
  }

  addElement(index: number, createContent?: () => PostContent) {
    let content: PostContent;
    if (!createContent) {
      content = new PostContentPlaceholder();
    } else {
      content = createContent();
    }

    var post = this.editedPost$.value;

    if (post == null) return;
    if (!post.contents) post.contents = [];

    index += 1;
    content.order = index;
    post.contents.splice(index, 0, content);

    for (let id = 0; id < post.contents.length; id++) {
      post.contents[id].order = id;
    }
  }

  addHeaderAfter(index: number) {
    console.log(index);
    
    this.addElement(index, () => new PostParagraphHeader());
  }

  addParagraphAfter(index: number) {
    this.addElement(index, () => new PostParagraph());
  }

  addImageAfter(index: number) {
    this.addElement(index, () => new PostImage());
  }

  updateContentValue(order: number, newValue: any) {
    const currentPost = this.editedPost$.value;
    if (currentPost) {
      const contentToUpdate = currentPost.contents?.find(content => content.order === order);
      if (contentToUpdate) {
        console.log('content to update:');
        console.log(contentToUpdate);
        
        contentToUpdate.data = {...contentToUpdate.data, ...newValue};
        // Emit the updated post
        this.editedPost$.next(currentPost);
      }
    }
  }

  updateHeaderValue(data: { title?: string; description?: string; }) {
    const newValue = {...this.editedPost$.value, ...data} as Post;
    this.editedPost$.next(newValue);
  }

  checkHeaderChanges() {
    const edited = this.editedPost$.value;
    const current = this.originalPost;

    console.log(edited);
  }

  checkContentChanges() {
    this.toAddOrUpdate = [];
    this.toDelete = [];

    const editedContents = this.editedPost$.value?.contents;
    const currentContents = this.originalPost?.contents;

    if (!editedContents || !currentContents)
      return;
    
    const currentMap = new Map(currentContents.map(node => [node.id, node]));
  
    // Identify modified or new nodes
    editedContents.forEach(editedNode => {
      const currentNode = currentMap.get(editedNode.id);
  
      // If the node doesn't exist or is modified, we need to add/update it
      if (!currentNode || JSON.stringify(currentNode) !== JSON.stringify(editedNode)) {
        this.toAddOrUpdate.push(editedNode);
      }
  
      // Remove the node from the map, so we can identify deleted ones later
      currentMap.delete(editedNode.id);
    });
  
    // Remaining nodes in currentMap are the ones to be deleted
    currentMap.forEach((_, nodeId) => {
      if (nodeId != undefined)
      this.toDelete.push(nodeId);
    });
  }

  saveChanges() {
    this.checkHeaderChanges();
    this.checkContentChanges();

    console.log('To add: ');
    console.log(this.toAddOrUpdate);
    
    console.log('To delete: ');
    console.log(this.toDelete);
  }
}
