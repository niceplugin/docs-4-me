<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  name: string
  alt: string
}>()

const { isDark } = useData()

const baseUrl = 'https://assets.docs4me.kr/filament/3.x'
const themeMode = computed(() => isDark.value ? 'dark' : 'light')
const src = computed(() => `${ baseUrl }/${ themeMode.value }/${ props.name }.jpg`)
</script>

<template>
  <img class="auto-screenshot" loading="lazy" decoding="async" :src :alt>
</template>

<style scoped>
.auto-screenshot {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 16px 0;
  border: 1px solid var(--vp-code-block-bg);
}
</style>
