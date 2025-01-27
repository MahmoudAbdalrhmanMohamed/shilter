<template>
  <div :class="cardClasses">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("readingHistory") }}</h3>
        <p class="text-muted my-auto">{{ $t("yourRecentlyReadChapters") }}.</p>
      </div>
      <div class="card-body">
        <div
          v-for="chapter in data"
          :key="chapter.id"
          class="d-flex align-items-center mb-5"
        >
          <div class="flex-grow-1">
            <div class="fw-bold fs-5">{{ chapter.title }}</div>
            <div class="text-muted">{{ chapter.comicTitle }}</div>
            <div class="text-muted small">{{ chapter.readDate }}</div>
          </div>
          <button
            class="btn btn-icon btn-light btn-sm"
            @click="removeChapter(chapter)"
          >
            <i class="fas fa-trash text-danger"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true,
  },
  cardClasses: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["remove-chapter"]);

const removeChapter = (chapter) => {
  emit("remove-chapter", chapter); // Emit event to parent
};
</script>
