<script setup>
    import { useRouter } from 'vue-router';

    const router = useRouter()

    const props = defineProps({
        book : {
            type: Object,
            required: true
        }
    })

    function navigateToBook(bookItem){
            router.push(
            {path: `/book-item/${bookItem.id}`})
        }

    const base64Image =  'data:image/png;base64, '

</script>

<template>
    <div class="bookFlex" @click="navigateToBook(book)">
        <img :src="base64Image + book.image" alt="book image didn't load">
            <p class="bookTitle">{{ book.title }}</p>
            <p class="bookAuthor">{{ book.author }}</p>
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
        width: 50%;
        height: 100%;
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