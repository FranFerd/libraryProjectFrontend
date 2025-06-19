<script setup lang="ts">
import type { OriginalValues } from '../types/Book';
const props = defineProps<{
    originalValues: OriginalValues
}>()
</script>
<template>
<p><em>Title</em> : {{ props.originalValues.title }}</p>
<p><em>Author</em> : {{ props.originalValues.author }}</p>
<p><em>Pages</em> : {{ props.originalValues.pages }}</p>
<p><em>Year of publish</em> : {{ props.originalValues.yearOfPublish }}</p>
<p><em>Description</em> : {{ props.originalValues.description }}</p>
</template>
<style scoped>
p{
    margin-top: 1em;
    font-size: 2em;
}
</style>