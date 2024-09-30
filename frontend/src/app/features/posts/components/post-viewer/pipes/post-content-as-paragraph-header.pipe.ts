import { Pipe, PipeTransform } from '@angular/core';

import { PostContent } from '../../../models/PostContent';
import { PostParagraphHeader } from '../../../models/PostParagraphHeader';

@Pipe({
  name: 'asParagraphHeader',
  standalone: true,
})
export class PostContentAsParagraphHeaderPipe implements PipeTransform {
  transform(value: PostContent, ...args: any[]): PostParagraphHeader {
    return value as PostParagraphHeader;
  }
}
