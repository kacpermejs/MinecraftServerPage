import { Pipe, PipeTransform } from '@angular/core';
import { PostContent, PostParagraph } from '../../../models/post';

@Pipe({
  name: 'asParagraph',
  standalone: true,
})
export class PostContentAsParagraphPipe implements PipeTransform {
  transform(value: PostContent, ...args: any[]): PostParagraph {
    return value as PostParagraph;
  }
}
