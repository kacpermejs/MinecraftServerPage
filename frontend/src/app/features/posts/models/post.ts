import { Timestamp } from "@angular/fire/firestore";

export interface Post {
    id?: string;
    date?: Date | Timestamp;

    title: string;
    published: boolean;

    description?: string;
    authorId?: string;
    contents?: PostContents[]
    thumbnailUrl?: string;
}

export interface PostContents {
    type: string;
}

export class PostText implements PostContents {
    type = 'text';

    value?: string;
}

export class PostImage implements PostContents {
    type = 'image';

    url?: string;
    label?: string;
}

export function getMockPosts(): Post[] {
    let posts: Post[] = [];

    const contentText: PostContents = {
        value: "bla bla bla dfjdsg"
    } as PostText;

    const contentImage: PostContents = {
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