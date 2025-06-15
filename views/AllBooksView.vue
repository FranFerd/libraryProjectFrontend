<script setup lang="ts">
    import Book from '@/components/Book.vue';
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import type { BookDescription } from '../src/types/Book';



    // const books: Ref<Book[]> = ref([])
    const books = ref<BookDescription[]>([])
    const isLoading = ref(true)
    const isNotLoaded = ref(false)

    async function fetchApiBooks(): Promise<void>{
        try{
            const response = await axios.get('http://localhost:5000/books')
            books.value = response.data
            console.log(books.value)
        }
        catch(error){
            console.error(error)
            isNotLoaded.value = true
        }
        finally{
            isLoading.value = false
        }
  } 

    onMounted(() => {
        fetchApiBooks()
    })

</script>

<template>
    <div v-if="isLoading" class="pageLoad" id="loading">Loading books<span class="dots"></span></div>
    <div v-if="isNotLoaded" class="pageLoad" id="didNotLoad">Couldn't load books</div>
    <div class="book">
        <Book v-for="book in books" :book="book"></Book>
    </div>
</template>

<style scoped>
    .book{
        display: flex;
        gap: 1rem;
        margin: 1rem;
        flex-wrap: wrap;
        justify-content: space-evenly;

    }
    .pageLoad{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        min-height: 80vh;
    }
    #didNotLoad{
        color: #b10909;
    }
    #loading {
        font-size: 2em;
        color: #333;
    }
    .dots{
        display: inline-block;
        width: 20px;
        overflow: hidden;
        vertical-align: bottom;
    }
    .dots::after {
        content: '...';
        display: inline-block;
        animation: dotAnimation 1.5s infinite;
    }
    @keyframes dotAnimation {
        0% {
            opacity: 0;
            transform: translateX(-20px);
        }
        33% {
            opacity: 1;
            transform: translateX(0);
        }
        66% {
            opacity: 1;
            transform: translateX(0);
        }
        100% {
            opacity: 0;
            transform: translateX(20px);
        }   
    }
</style>