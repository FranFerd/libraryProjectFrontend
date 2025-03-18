<script setup>

    import { useRouter } from 'vue-router';
    import { ref } from 'vue';
    import { useModeStore } from '../stores/editModeStore';

    const searchValue = ref(null)
    const router = useRouter()
    const modeStore = useModeStore()

    function navigateToEdit() {
    if (!searchValue.value?.trim()) {
        alert('Please enter a search term');
        return;
    }
    else{
        modeStore.setEditMode(true)
        router.push({
        path: '/book-search',
        query: { name: searchValue.value }
    })
    }
}
</script>

<template>
    <div>
        <h1>Whick book do you want to update?</h1>
        <form @submit.prevent="navigateToEdit">
            <input type="text" placeholder="Search book" v-model="searchValue">
            <button type="submit" >Search</button>
        </form>
    </div>
</template>