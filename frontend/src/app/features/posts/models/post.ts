import { Timestamp } from "@angular/fire/firestore";

export interface Post {
    id?: string;
    date?: Date | Timestamp;

    title: string;
    published: boolean;

    description?: string;
    authorId?: string;
    contents?: PostContent[]
    thumbnailUrl?: string;
}

export abstract class PostContent {
    abstract type: string;
    order: number = -1;
}

export class PostParagraphHeader extends PostContent {
    type = 'paragraph.header'

    text?: string;
}

export class PostParagraph extends PostContent {
    type = 'paragraph.text';

    text?: string;
}

export class PostImage extends PostContent {
    type = 'image';

    url?: string;
    label?: string;
}

export function getMockPosts(): Post[] {
    let posts: Post[] = [];

    const contentText: PostContent = {
        text: "bla bla bla dfjdsg"
    } as PostParagraph;

    const contentImage: PostContent = {
        url: '/assets/images/sample.png',
        label: 'sample label'
    } as PostImage;
    
    for (let id = 0; id < 20; id++) {
        posts.push(
            {
                id: id.toString(),
                title: "title" + id,
                published: false,
                description: "desc" + id,
                date: new Date(),
                thumbnailUrl: "/assets/images/sample.png",
                contents: [contentText, contentImage]
            }
        );
    }
    return posts;
}