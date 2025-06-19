<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import type {BookPreview} from '../types/Book'

    const router = useRouter()

    const props = defineProps<{
        book :  BookPreview
    }>()


    function navigateToBook(): void{
            router.push(
            {path: `/book-item/${props.book.id}`})
        }

    const base64Image =  'data:image/png;base64, '

</script>

<template>
    <div class="bookFlex" @click="navigateToBook()">
        <img :src="base64Image + props.book.image" alt="book image didn't load">
            <p class="bookTitle">{{ props.book.title }}</p>
            <p class="bookAuthor">{{ props.book.author }}</p>
    </div>
</template>

<style scoped>
    .bookFlex{
        display: flex;
        flex-direction: column;
        border: black solid;
        width: 17%;
        cursor: pointer;
    }
    img{
        width: 130px;
        height: 200px;
        margin-right: auto;
        margin-left: auto;
        margin-top: 5px;
        border-radius: 2px;
    }
    p{
        font-size: 20px;
        text-align: center;
        margin: 5px;
    }
</style>