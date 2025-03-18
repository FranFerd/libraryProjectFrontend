<script setup>

  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';


  const formData = ref({
    title: '',
    author: '',
    pages: '',
    yearOfPublish: '',
    description: '',
    image: null
  })

  const message = ref('')
  const isDisabledButton = ref(false)
  const router = useRouter()
  const successMessage = ref(false)

  async function redirectToBook(time, data){
    setTimeout(async () => {
      const bookId = await(getBookId(data))
      router.push(
      {path: `/book-item/${bookId}`})
    }, time);
  }

  async function getBookId(data){
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

  async function submitForm(){
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
        successMessage.value = true
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

  function handleFileUpload(event){
    formData.value.image = event.target.files[0]
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
    <p v-if="message" :class="{success : successMessage, error : !successMessage }">{{ message }}</p>
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