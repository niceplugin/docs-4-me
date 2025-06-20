<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()

const hideOn = computed(() => route.path === '/')
</script>

<template>
  <div v-if="hideOn" class="search-hider"/>
</template>

<style>
.search-hider + .search {
  display: none;
}
</style>
