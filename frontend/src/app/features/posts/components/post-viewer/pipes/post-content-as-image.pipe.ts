import { Pipe, PipeTransform } from '@angular/core';

import { PostContent } from '../../../models/PostContent';
import { PostImage } from '../../../models/PostImage';

@Pipe({
  name: 'asImage',
  standalone: true,
})
export class PostContentAsImagePipe implements PipeTransform {
  transform(value: PostContent, ...args: any[]): PostImage {
    return value as PostImage;
  }
}
