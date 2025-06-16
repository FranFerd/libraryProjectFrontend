export interface BookPreview{
    id: number,
    title: string,
    author: string,
    image: string
}

export interface BookDescription {
    author: string,
    description: string,
    id: number,
    image: string,
    pages: number,
    title: string,
    yearOfPublish: string
}

export interface BookToPost {
    title: string,
    author: string,
    pages: string,
    yearOfPublish: string,
    description: string,
    image: File | null
}
