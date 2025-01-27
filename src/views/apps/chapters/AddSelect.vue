<template>
  <!-- Wrapper -->
  <div class="md:p-10">
    <div class="text-center mb-10">
      <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
        {{ $t("AddSelect") }}
      </h1>
    </div>

    <div class="grid gap-4">
      <!-- Add Chapter Button -->
      <router-link
        :to="{ name: 'apps-chapter-add-one' }"
        class="btn btn-primary"
      >
        <KTIcon icon-name="plus" icon-class="fs-2" />
        {{ $t("addOneChapter") }}
      </router-link>
      <router-link :to="{ name: 'apps-chapter-add-all' }" class="btn btn-info">
        <KTIcon icon-name="plus" icon-class="fs-2" />
        {{ $t("addAllChapters") }}
      </router-link>

      <router-link
        :to="{ name: 'apps-chapter-add-url' }"
        class="btn btn-success"
      >
        <KTIcon icon-name="plus" icon-class="fs-2" />
        {{ $t("insertUrl") }}
      </router-link>

      <router-link
        :to="{ name: 'apps-chapter-add-zip' }"
        class="btn btn-warning"
      >
        <KTIcon icon-name="plus" icon-class="fs-2" />
        {{ $t("insertZip") }}
      </router-link>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

</script>
