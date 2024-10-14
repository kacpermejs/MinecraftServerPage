import { Post } from "./post";
import { PostContent } from './PostContent';
import { PostParagraph } from './PostParagraph';
import { PostImage } from './PostImage';


export function getMockPosts(): Post[] {
  let posts: Post[] = [];

  const contentText: PostContent = {
    data: {
      text: 'bla bla bla dfjdsg'
    }
  } as PostParagraph;

  const contentImage: PostContent = {
    data: {
      fileId: '/assets/images/sample.png', //won't work because of new url resolving from fileId
      label: 'sample label',
    },
  } as PostImage;

  for (let id = 0; id < 20; id++) {
    posts.push({
      id: id.toString(),
      title: 'title' + id,
      published: false,
      description: 'desc' + id,
      date: new Date(),
      thumbnailUrl: '/assets/images/sample.png',
      contents: [contentText, contentImage],
    });
  }
  return posts;
}
