import { Timestamp } from '@angular/fire/firestore';

import { PostContent } from './PostContent';

export interface Post {
  id?: string;
  date?: Date | Timestamp;

  title: string;
  published: boolean;

  description?: string;
  authorId?: string;
  contents?: PostContent[];
  thumbnailUrl?: string;
}
