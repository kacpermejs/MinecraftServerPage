import { PostContent } from './PostContent';

interface ImageData {
  fileId?: string;
  label?: string;
}

export class PostImage extends PostContent<ImageData> {
  type = 'image';
  
  data: ImageData = {};
}
