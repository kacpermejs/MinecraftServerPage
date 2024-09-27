import { Pipe, PipeTransform } from '@angular/core';
import { PostContent, PostParagraphHeader } from '../../../models/post';

@Pipe({
  name: 'asParagraphHeader',
  standalone: true,
})
export class PostContentAsParagraphHeaderPipe implements PipeTransform {
  transform(value: PostContent, ...args: any[]): PostParagraphHeader {
    return value as PostParagraphHeader;
  }
}
