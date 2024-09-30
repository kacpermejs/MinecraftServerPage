import { PostContent } from './PostContent';

interface ParagraphHeaderData { text: string; }

export class PostParagraphHeader extends PostContent {
  type = 'paragraph.header';
  data: ParagraphHeaderData = { text: '' };;
}
