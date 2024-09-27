import { Pipe, PipeTransform } from '@angular/core';
import { PostContent, PostImage, PostParagraph } from '../../../models/post';

@Pipe({
  name: 'asImage',
  standalone: true,
})
export class PostContentAsImagePipe implements PipeTransform {
  transform(value: PostContent, ...args: any[]): PostImage {
    return value as PostImage;
  }
}
