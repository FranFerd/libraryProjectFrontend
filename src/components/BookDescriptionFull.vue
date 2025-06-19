<script setup lang="ts">
import axios from 'axios';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { OriginalValues, BookDescription } from '../types/Book';
import BookEditMode from './BookEditMode.vue';
import BookOriginalDescription from './BookOriginalDescription.vue';

const route = useRoute()
const router = useRouter()

const props = defineProps<{
    bookDescription: BookDescription,
    editMode: Boolean
    deleteMode: Boolean
}>()

const bookId = route.fullPath.slice(11)

const fileInput = ref<HTMLInputElement | null>(null)
const newImage = ref<string | null>(null)

const deleteMessage = ref('')
const isSuccessMessage = ref(false)

const originalValues = ref<OriginalValues | null>(null)

const isDeleted = ref(false)
const isDisabledButton = ref(false)

const editMode = ref(props.editMode)
const deleteMode = ref(props.deleteMode)

function setOriginalValues(): void{
    originalValues.value = {
        title: props.bookDescription.title,         
        author: props.bookDescription.author,
        pages: props.bookDescription.pages,
        yearOfPublish: props.bookDescription.yearOfPublish,
        description: props.bookDescription.description,
        image: props.bookDescription.image
    }
}

function toggleEdit(): void {
    editMode.value = !editMode.value
    deleteMode.value = false
    if(!editMode.value) resetImage() // reset when leaving
}

function resetImage(): void {
    if (newImage.value) {
        URL.revokeObjectURL(newImage.value)
        newImage.value = null
    }
    if (fileInput.value) {
        fileInput.value.value = '' // 1st .value accesses the DOM element inside ref(HTMLInputElement)
    }                              // 2nd .value accesses the input's element current text/value(HTMLInputElement.value)
}

function toggleDelete(): void {
    deleteMode.value = !deleteMode.value
}

function handleImageSelected(file: File): void{
    if(newImage.value){
        URL.revokeObjectURL(newImage.value)
    }
    newImage.value = URL.createObjectURL(file)
}

async function deleteBook(bookId: string) {
    try{
        const response = await axios.delete(`http://127.0.0.1:5000/book-delete/${bookId}`)
        if (response.status === 200){
            isDeleted.value = true
            isSuccessMessage.value = true
            deleteMessage.value = 'Book deleted successfully. Redirecting to home page...'
            setTimeout(() => {
                router.push(
                    {path: '/home' })
            }, 1500)
        }
    }
    catch(error){
        console.error('Error: ', error)
        deleteMessage.value = 'Failed to delete book'
    }
}

onMounted(() => {
    if(props.bookDescription){
        setOriginalValues()
    }
})

onBeforeUnmount(() => {
    if(newImage.value){
        URL.revokeObjectURL(newImage.value)
    }
})
</script>

<template>
    <div class="book" v-if="originalValues">
        <img :src="newImage || 'data:image/png;base64, ' + originalValues.image" :alt=props.bookDescription.title>
        <div class="book__info" v-if="!editMode">
            <BookOriginalDescription
            :originalValues="originalValues"
            ></BookOriginalDescription>
        </div>
        <div class="book__info" v-if="editMode">
            <BookEditMode
            :originalValues="originalValues"
            @image-selected="handleImageSelected"
            ></BookEditMode>
        </div>    
    </div>
    <div>
        <button @click="toggleEdit" class="editButton" :title="editMode ? 'Cancel edit' : 'Click here to update the book'" :disabled="isDisabledButton">
            <svg xmlns="http://www.w3.org/2000/svg" class="editSVG" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30"> <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
            </svg>
        </button>
    </div>
    <div class="book__delete">
        <div>
            <button @click="toggleDelete" class="deleteButton" :title="deleteMode ? 'Cancel delete' : 'Click here to delete the book'" :disabled="isDisabledButton">
                <svg xmlns="http://www.w3.org/2000/svg" class="deleteSVG" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24"><path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                </svg>
            </button>
        </div>
        <div v-if="deleteMode">
            <p>Are you sure you want to delete this book?</p>
            <button @click="toggleDelete()">No</button>
            <button @click="deleteBook(bookId)">Yes</button>
        </div>
        <p v-if="deleteMessage" :class="{success : isSuccessMessage, error : !isSuccessMessage }">
            {{ deleteMessage }}
        </p>
    </div> 
</template>
<style scoped>
.editSVG{
    height: 1.5em;
    width: 5em;
    padding: .5em;
    color: transparent;
}
.deleteSVG{
    height: 1.5em;
    width: 5em;
    padding: .5em;
    color: transparent;
}
.editButton{
    cursor: pointer;
    background-color: rgb(219, 225, 38);
}
.deleteButton{
    cursor: pointer;
    background-color: rgb(208, 45, 45);
    margin-top: 1em;
}
.editDescription{
    height: 200px;
    width: 700px;
    font-size: large;
}
img{
    height: 600px;
    width: 25%;
    padding: 1em;
    float: left;
    margin-right: 10px;
}
.book{
    margin: 1em;
}
p{
    margin-top: 1em;
    font-size: 2em;
}
p.success{
color: rgb(32, 195, 32);
}
p.error{
color: rgb(225, 40, 40);
}
</style>