<script setup lang="ts">
import Table from "./components/Table.vue";
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<template>
  <div>
    <Header />
    <main class="content"><Table /></main>
    <Footer />
  </div>
</template>

<style scoped></style>
