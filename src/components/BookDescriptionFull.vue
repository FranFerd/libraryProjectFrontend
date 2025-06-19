<script setup lang="ts">
    import axios from 'axios';
    import { onBeforeUnmount, onMounted, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import type { BookToPost, OriginalValues, BookDescription } from '../types/Book';

    const route = useRoute()
    const router = useRouter()

    const props = defineProps<{
        bookDescription: BookDescription,
        editMode: Boolean
        deleteMode: Boolean
    }>()

    const bookId = route.fullPath.slice(11)

    const editMessage = ref<string>('')
    const deleteMessage = ref('')
    const isSuccessMessage = ref(false)

    const newImage = ref<string | null>(null)
    const originalValues = ref<OriginalValues | null>(null)

    const isDeleted = ref(false)
    const isDisabledButton = ref(false)

    const editMode = ref(props.editMode)
    const deleteMode = ref(props.deleteMode)
    
    const formData = ref<BookToPost>({
        title: '',
        author: '',
        pages: '',
        yearOfPublish: '', 
        description: '',
        image: originalValues.value?.image ?? null
    })

    function cacheOrResetOriginalValues(): void {
        if(originalValues.value){
            formData.value = {
                title: originalValues.value.title,          
                author: originalValues.value.author,        
                pages: String(originalValues.value.pages),          
                yearOfPublish: originalValues.value.yearOfPublish,  
                description: originalValues.value.description,
                image: originalValues.value.image
            }
        }
    }

    function toggleEdit(): void {
        editMode.value = !editMode.value
        deleteMode.value = false
        if(!editMode.value) resetValues() // reset when leaving
    }

    function resetValues(): void {
        if(originalValues.value){
            cacheOrResetOriginalValues()
        }
        const fileinput = ref<HTMLInputElement | null>(null)
        if (newImage.value) {
            URL.revokeObjectURL(newImage.value)
            newImage.value = null
        }
        if (fileinput.value) {
            console.log(fileinput.value)
            fileinput.value.value = ''
        }
    }

    function toggleDelete(): void {
        deleteMode.value = !deleteMode.value
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

    function addDataToSubmit(): FormData{
        const data = new FormData()

        data.append('id', bookId)
        data.append('title', formData.value.title)
        data.append('author', formData.value.author)
        data.append('pages', formData.value.pages)
        data.append('yearOfPublish', formData.value.yearOfPublish)
        data.append('description', formData.value.description)

        if(formData.value.image) { // formData.image can be null
            data.append('image', formData.value.image)
        }

        return data
    }

    async function submitChanges(): Promise<void>{
        try{
            const data = addDataToSubmit()
            const response = await axios.put('http://127.0.0.1:5000/book-update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.status == 200) {
                isDisabledButton.value = true
                isSuccessMessage.value = true
                editMessage.value = 'Book updated successfully. Reloading page...'
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            }
            else{
                editMessage.value = "Failed to update book"
            }
        }
        catch(error){
            console.error('Error: ', error)
            editMessage.value = 'An error ocurred while updating'
        }
    }

    function handleFileUpload(event: Event): void{
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]
        if(file){
            if(newImage.value) URL.revokeObjectURL(newImage.value)
            newImage.value = URL.createObjectURL(file)
            formData.value.image = file
        }
    }

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

    onMounted(() => {
        if(props.bookDescription){
            setOriginalValues()
            cacheOrResetOriginalValues() // fills form data
        }
        console.log(props.bookDescription)
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
            <p><em>Title</em> : {{ originalValues.title }}</p>
            <p><em>Author</em> : {{ originalValues.author }}</p>
            <p><em>Pages</em> : {{ originalValues.pages }}</p>
            <p><em>Year of publish</em> : {{ originalValues.yearOfPublish }}</p>
            <p><em>Description</em> : {{ originalValues.description }}</p>
        </div>
        <div class="book__info" v-if="editMode">
            <div>
                <label for="image">Upload Image:</label>
                <input type="file" id="image" ref="fileInput" @change="handleFileUpload" name="image" accept="image/*" required><br><br>
            </div>
            <form @submit.prevent="submitChanges">
                <p><em>Title</em> : <input type="text" id="title" v-model="formData.title"> </p>
                <p><em>Author</em> : <input type="text" id="author" v-model="formData.author"></p>
                <p><em>Pages</em> : <input type="number" id="pages" v-model="formData.pages"></p>
                <p><em>Year of publish</em> : <input type="number" id="yearOfPublish" v-model="formData.yearOfPublish"></p>
                <p><em>Description</em> : <textarea id="description" v-model="formData.description" class="editDescription"></textarea></p>
                <button type="submit" class="saveChanges" :disabled="isDisabledButton">
                    Save
                </button>
                <p v-if="editMessage" :class="{success : isSuccessMessage, error : !isSuccessMessage}">{{ editMessage }}</p>
            </form>
        </div>    
    </div>
    <div>
        <button @click="toggleEdit" class="editButton" :title="editMode ? 'Cancel edit' : 'Click here to update the book'" :disabled="isDisabledButton">

            <svg xmlns="http://www.w3.org/2000/svg" class="editSVG"
                x="0px" 
                y="0px" 
                width="30" 
                height="30" 
                viewBox="0 0 30 30">
                <path d="M 22.828125 3 C 22.316375 3 21.804562 3.1954375 21.414062 3.5859375 L 19 6 L 24 11 L 26.414062 8.5859375 C 27.195062 7.8049375 27.195062 6.5388125 26.414062 5.7578125 L 24.242188 3.5859375 C 23.851688 3.1954375 23.339875 3 22.828125 3 z M 17 8 L 5.2597656 19.740234 C 5.2597656 19.740234 6.1775313 19.658 6.5195312 20 C 6.8615312 20.342 6.58 22.58 7 23 C 7.42 23.42 9.6438906 23.124359 9.9628906 23.443359 C 10.281891 23.762359 10.259766 24.740234 10.259766 24.740234 L 22 13 L 17 8 z M 4 23 L 3.0566406 25.671875 A 1 1 0 0 0 3 26 A 1 1 0 0 0 4 27 A 1 1 0 0 0 4.328125 26.943359 A 1 1 0 0 0 4.3378906 26.939453 L 4.3632812 26.931641 A 1 1 0 0 0 4.3691406 26.927734 L 7 26 L 5.5 24.5 L 4 23 z"></path>
            </svg>
        </button>
    </div>
    <div class="book__delete">
        <div>
            <button @click="toggleDelete" class="deleteButton" :title="deleteMode ? 'Cancel delete' : 'Click here to delete the book'" :disabled="isDisabledButton">
                <svg xmlns="http://www.w3.org/2000/svg" class="deleteSVG"
                    x="0px" 
                    y="0px" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24">
                    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
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
    .saveChanges{
        background-color: rgb(77, 184, 77);
        height: 3em;
        width: 5em;
        cursor: pointer;
    }
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
        height: 50%;
        width: 25%;
        padding: 1em;
        float: left;
        margin-right: 10px;
    }
    .book{
        /* display: flex; */
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