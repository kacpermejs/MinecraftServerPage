import { PostContent } from './PostContent';

interface ParagraphData { text: string; }

export class PostParagraph extends PostContent {
  type = 'paragraph.text';
  data: ParagraphData = { text: '' };
}
