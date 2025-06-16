<script setup lang="ts">

import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { BookToPost } from '@/types/Book';

const router = useRouter()

const formData = ref<BookToPost>({
  title: '',
  author: '',
  pages: '',
  yearOfPublish: '',
  description: '',
  image: null
})

const message = ref<string>('')
const isDisabledButton = ref(false)
const isSuccessMessage = ref(false)

async function redirectToBook(time: number, data: FormData): Promise<void>{
  setTimeout(async () => {
    const bookId = await(getBookId(data))
    router.push(
    {path: `/book-item/${bookId}`})
}, time);
}

async function getBookId(data: FormData): Promise<number>{
  try {
    const response = await axios.post('http://localhost:5000/book-id', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.bookId;
  } 
  catch (error) {
    console.error('Error fetching bookId:', error);
    throw error; 
  }
}

async function submitForm(): Promise<void>{
  try{
    const data = new FormData()
    data.append('title', formData.value.title);
    data.append('author', formData.value.author);
    data.append('pages', formData.value.pages);
    data.append('yearOfPublish', formData.value.yearOfPublish);
    data.append('description', formData.value.description);
    data.append('image', formData.value.image);

  const response = await axios.post('http://localhost:5000/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
    });

  if(response.status === 200){
    message.value = 'File and data uploaded successfully. Redirecting to the book page...'
    isDisabledButton.value = true
    isSuccessMessage.value = true
    redirectToBook(1500, data)
  }
  else{
    message.value = 'Failed to upload file and data'
  }

  }
  catch(error){
    console.error('Error: ', error)
    message.value = 'An error ocurred while uploading'
  }
}

function handleFileUpload(event: Event){          // event.target is the element that triggered the event
  const target = event.target as HTMLInputElement // By default event.target is EventTarget type, which doesn't have .files
  const file = target.files[0]                    // So I assert that event.target is HTMLInputElement, which has .files
  formData.value.image = file
}


</script>

<template>
    <div>
      <form @submit.prevent="submitForm">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="formData.title" name="title" required><br><br>

        <label for="author">Author:</label>
        <input type="text" id="author" v-model="formData.author"  name="author" required><br><br>

        <label for="pages">Pages:</label>
        <input type="number" id="pages" v-model="formData.pages"  name="pages" required><br><br>

        <label for="yearOfPublish">Year of Publish:</label>
        <input type="number" id="yearOfPublish" v-model="formData.yearOfPublish"  name="yearOfPublish" required><br><br>

        <label for="description">Description:</label>
        <textarea id="description" v-model="formData.description"  name="description" required></textarea><br><br>

        <label for="image">Upload Image:</label>
        <input type="file" id="image" @change="handleFileUpload" name="image" accept="image/*" required><br><br>

        <button type="submit" :disabled="isDisabledButton">Upload</button>
    </form>
    <p v-if="message" :class="{success : isSuccessMessage, error : !isSuccessMessage }">{{ message }}</p>
    </div>
  </template>
  
  <style scoped>
  #description{
    height: 6em;
    width: 20em;
    margin-left: 1em;
  }
  p{
    font-size: 2em;
  }
  p.success{
    color: rgb(32, 195, 32);
  }
  p.error{
    color: rgb(225, 40, 40);
  }

  </style>