<script setup lang="ts">
  import BookDescriptionFull from '@/components/BookDescriptionFull.vue';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useModeStore } from '../stores/editModeStore';
  import axios from 'axios';
  import type { BookDescription } from '../src/types/Book';

  const route = useRoute()

  const books = ref<BookDescription[] | null>(null)
  const book = ref<BookDescription | null>(null)
  const bookIdUrl = ref<string>(handleBookIdUrl())

  const modeStore = useModeStore()
  const editMode = ref(modeStore.editMode)
  const deleteMode = ref(modeStore.deleteMode)

  function handleBookIdUrl() :string{
    const idParam = route.params.id
    if(Array.isArray(idParam)){
      return idParam[0] || ''
    }
    return idParam || ''
  }

  async function fetchApiBooks(): Promise<void>{
    try{
      const response = await axios.get('http://localhost:5000/books')
      books.value = response.data
      book.value = initBook()
      console.log(book.value)
    }
    catch(error){
      console.error(error)
    }
} 

  onMounted(() => {
      fetchApiBooks()
    });


  function initBook(): BookDescription{
    for(let bookItem of books.value){
      if(bookItem.id == Number(bookIdUrl.value)){
        return bookItem
      }
    }

  }
    
</script>

<template>
  <div v-if="book">
    <BookDescriptionFull :book-description="book" :edit-mode="editMode" :delete-mode="deleteMode" ></BookDescriptionFull>
  </div>
</template>

