export interface BookPreview{
    id: number,
    title: string,
    author: string,
    image: string
}

export interface BookDescription {
    title: string,
    author: string,
    description: string,
    id: number,
    image: string,
    pages: number,
    yearOfPublish: string
}

export interface BookToPost {
    title: string,
    author: string,
    pages: string,
    yearOfPublish: string,
    description: string,
    image: File | null | string
}

export interface OriginalValues {
    title: string,
    author: string,
    pages: number
    yearOfPublish: string,
    description: string,
    image: string 
}
