export interface Post {
    id: number;
    title: string;
    date: string;
    description: string;

    imageUrl: string;
}

export function getMockPosts(): Post[] {
    let posts: Post[] = [];
    
    for (let id = 0; id < 20; id++) {
        posts.push(
            {
                id: id,
                title: "title" + id,
                description: "desc" + id,
                date: "18-08-2024",
                imageUrl: "/assets/images/sample.png"
            }
        );
    }
    return posts;
}