<script setup>
  import BookDescription from '@/components/BookDescription.vue';
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { useModeStore } from '../stores/editModeStore';

  const books = ref(null)
  const route = useRoute()
  const bookIdUrl = ref(route.params.id)
  const book = ref(null)
  const modeStore = useModeStore()
  const editMode = ref(modeStore.editMode)
  const deleteMode = ref(modeStore.deleteMode)


  async function fetchApiBooks(){
    try{
      const response = await axios.get('http://localhost:5000/books')
      books.value = response.data
      book.value = initBook()
    }
    catch(error){
      console.error(error)
    }
} 

  onMounted(() => {
      fetchApiBooks()
    });


  function initBook(){
    for(let bookItem of books.value){
      if(bookItem.id == bookIdUrl.value){
        return bookItem
      }
    }

  }
    
</script>

<template>
  <div v-if="book">
    <BookDescription :book-description="book" :edit-mode="editMode" :delete-mode="deleteMode" ></BookDescription>
  </div>
</template>

