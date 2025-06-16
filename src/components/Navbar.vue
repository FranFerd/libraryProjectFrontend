<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute} from 'vue-router';

  const router = useRouter()
  const searchValue = ref<string>('')

  function pushToUrl(): void {
  if (!searchValue.value?.trim()) {
    alert('Please enter a search term');
    return;
  }
  router.push({
    path: '/book-search',
    query: { name: searchValue.value },
  });
}

  function isActive(urlComponent: string): boolean{
    const route = useRoute()
    if (route.fullPath.includes(urlComponent)){
      return true
    }
    return false
  }
</script> 

<template>
  <div class="topnav">
    <a :class="{ active: isActive('home')}" href="/home">Home</a>
    <a :class="{ active: isActive('books')}" href="/books">All Books</a>
    <a :class="{ active: isActive('book-item')}" class="no-hover">Book</a>
    <a :class="{ active: isActive('post-book')}" href="/post-book">Post Book</a>
    <a :class="{ active: isActive('update-book')}" href="/update-book">Update Book</a>
    <a :class="{ active: isActive('delete-book')}" href="/delete-book">Delete Book</a>
    <form id="searchForm" @submit.prevent="pushToUrl">
      <button type="submit" id="submitButton">
        <svg
          fill="#FFFFFF"
          id="searchSVG"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          width="32px"
          height="32px"
        >
          <path
            d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"
          />
        </svg>
      </button>
      <input type="text" placeholder="Search Book" id="searchBook" v-model="searchValue" />
    </form>
  </div>
</template>

<style scoped>
.topnav {
  background-color: #333;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 20px 22px;
  text-decoration: none;
  font-size: 30px;
}

/* Change the color of links on hover */
.topnav a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.no-hover {
  pointer-events: none; /* Disable all mouse interactions */
  cursor: default; /* Show default cursor */
}

.topnav a.no-hover:hover {
  background-color: inherit !important;
  color: inherit !important;
}

/* Add a color to the active/current link */
.topnav a.active {
  background-color: #04aa6d;
  color: white;
}
#searchBook {
  font-size: 20px;
  padding: 10px;
}
#searchForm {
  display: flex;
  justify-self: end;
  margin: 13px 4px;
}
#searchSVG {
  padding-top: 0.5em;
  margin-right: 3px;
  width: 32px;
  height: 40px;
  cursor: pointer;
}
#submitButton{
  border: 0px;
  background-color: #333
}
</style>
