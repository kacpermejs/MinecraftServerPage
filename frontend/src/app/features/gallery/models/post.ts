export interface Post {
    id?: string;
    title: string;
    description?: string;
    date?: Date;
    authorId?: string;

    thumbnailUrl?: string;
}

export function getMockPosts(): Post[] {
    let posts: Post[] = [];
    
    for (let id = 0; id < 20; id++) {
        posts.push(
            {
                id: id.toString(),
                title: "title" + id,
                description: "desc" + id,
                date: new Date(),
                thumbnailUrl: "/assets/images/sample.png"
            }
        );
    }
    return posts;
}