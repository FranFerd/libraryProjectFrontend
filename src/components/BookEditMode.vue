<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import axios from 'axios'
import type { BookToPost, OriginalValues } from '../types/Book'
import { useRoute } from 'vue-router'

const route = useRoute()

const editMessage = ref<string>('')

const isSuccessMessage = ref(false)
const isDisabledButton = ref(false)

const bookId: string = route.fullPath.slice(11)
const uploadedFile = ref<File | null>(null)

const props = defineProps<{
    originalValues: OriginalValues
}>()

const emit = defineEmits<{
    (e: 'image-selected', file: File) : void
}>()

const formData = ref<BookToPost>({
    title: '',
    author: '',
    pages: '',
    yearOfPublish: '', 
    description: '',
    image: props.originalValues.image
})

function addDataToSubmit(): FormData{
    const data = new FormData()

    data.append('id', bookId)
    data.append('title', formData.value.title)
    data.append('author', formData.value.author)
    data.append('pages', formData.value.pages)
    data.append('yearOfPublish', formData.value.yearOfPublish)
    data.append('description', formData.value.description)
    
    if(uploadedFile.value) {
        data.append('image', uploadedFile.value)
    }
    else if(formData.value.image){
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

function cacheOrResetOriginalValues(): void {
    if(props.originalValues){
        formData.value = {
            title: props.originalValues.title,          
            author: props.originalValues.author,        
            pages: String(props.originalValues.pages),          
            yearOfPublish: props.originalValues.yearOfPublish,  
            description: props.originalValues.description,
            image: props.originalValues.image
        }
    }
}

function handleFileUpload(event: Event): void{
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if(file){
        uploadedFile.value = file
        emit('image-selected', file)
    }
}

onMounted(() => {
    cacheOrResetOriginalValues()
    console.log(props.originalValues)
})
</script>
<template>
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
</template>
<style scoped>
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
.saveChanges{
    background-color: rgb(77, 184, 77);
    height: 3em;
    width: 5em;
    cursor: pointer;
}
</style>