import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllBooksView from '../views/AllBooksView.vue'
import BookSearchView from '../views/BookSearchView.vue'
import PostBookView from '../views/PostBookView.vue'
import SearchBookToUpdateView from '../views/SearchBookToUpdateView.vue'
import BookDescriptionView from '../views/BookDescriptionView.vue'
import SearchBookToDeleteView from '../views/SearchBookToDeleteView.vue'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/home',
            name: 'home',
            component: HomeView
        },
        {
            path: '/books',
            name: 'books',
            component: AllBooksView
        },
        {
            path: '/book-item/:id',
            name: 'bookDescription',
            component: BookDescriptionView
        },
        {
            path: '/book-search',
            name: 'bookSearch',
            component: BookSearchView
        },
        {
            path: '/post-book',
            name: 'postBook',
            component: PostBookView
        },
        {
            path: '/update-book',
            name: 'updateBook',
            component: SearchBookToUpdateView
        },
        {
            path: '/delete-book',
            name: 'deleteBook',
            component: SearchBookToDeleteView
        }
    ],
})

export default router