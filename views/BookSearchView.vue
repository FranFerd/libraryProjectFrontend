<script setup lang="ts">

import Book from '@/components/Book.vue';
import { onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import type { BookDescription } from '@/types/Book';

const route = useRoute()
const books = ref<BookDescription[] | []>([])

const isNoMatchesFound = ref(false)
const isLoading = ref(true)
const isNotLoaded = ref(false)

function resetBooleans(): void{
    isNoMatchesFound.value = false
    isLoading.value = true
    isNotLoaded.value = false
}

async function fetchBooksByName(name: string | string[]) :Promise<void>{
    resetBooleans()
    try{
        const nameParam = ref<string>('')
        if(Array.isArray(name)) nameParam.value = name[0]
        else nameParam.value = name
        
        const response = await axios.get(`http://127.0.0.1:5000/book-search?name=${encodeURIComponent(nameParam.value)}`)
        books.value = response.data

        if(books.value.length === 0){
            isNoMatchesFound.value = true
        }
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
    if(route.query.name){
        fetchBooksByName(route.query.name)
    }
})

watch(
    () => route.query.name,
    (newName: string) => {
        if (newName) {
        fetchBooksByName(newName);
        }
    }
);


</script>

<template>
<div v-if="isLoading" class="pageLoad" id="loading">Loading books<span class="dots"></span></div>
<div v-if="isNotLoaded" class="pageLoad" id="didNotLoad">Couldn't load books</div>
<div v-if="isNoMatchesFound" class="pageLoad" id="isNoMatchesFound">No matches found</div>
<div v-else class="bookSearch">
    <Book v-for="book in books" :book="book"></Book>
</div>
    
</template>

<style scoped>
.bookSearch{
    display: flex;
    gap: 1rem;
    margin: 1rem;
    flex-wrap: wrap;
}
.pageLoad{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 80vh;
    font-size: 2em;
}
#isNoMatchesFound{
    color: #b10909;
}
#didNotLoad{
    color: #b10909;
}
#loading {
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