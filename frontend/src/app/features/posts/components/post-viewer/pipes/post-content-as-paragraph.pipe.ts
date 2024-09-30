import { Pipe, PipeTransform } from '@angular/core';

import { PostContent } from '../../../models/PostContent';
import { PostParagraph } from '../../../models/PostParagraph';

@Pipe({
  name: 'asParagraph',
  standalone: true,
})
export class PostContentAsParagraphPipe implements PipeTransform {
  transform(value: PostContent, ...args: any[]): PostParagraph {
    return value as PostParagraph;
  }
}
