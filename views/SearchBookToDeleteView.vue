<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import { useModeStore } from '../stores/editModeStore';

    const router = useRouter()
    const modeStore = useModeStore()
    const searchValue = ref<string>('')

    function navigateToDelete(): void{
    if (!searchValue.value.trim()) {
        alert('Please enter a search term');
        return;
    }
    else{
        modeStore.setDeleteMode(true)
        router.push({
        path: '/book-search',
        query: { name: searchValue.value }
    })
    }
}
</script>

<template>
    <div>
        <h1>Whick book do you want to delete?</h1>
        <form @submit.prevent="navigateToDelete">
            <input type="text" placeholder="Search book" v-model="searchValue">
            <button type="submit" >Search</button>
        </form>
    </div>
</template>
