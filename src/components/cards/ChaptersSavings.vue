<template>
  <div :class="cardClasses">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("savedChapters") }}</h3>
        <p class="text-muted my-auto">
          {{ $t("yourCollectionOfSavedChapters") }}.
        </p>
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
            <div class="mt-2">
              <span
                class="badge"
                :class="`badge-${chapter.status === 'Saved' ? 'info' : 'warning'}`"
              >
                {{ chapter.status }}
              </span>
            </div>
          </div>
          <button
            class="btn btn-icon btn-light btn-sm"
            @click="toggleSave(chapter)"
          >
            <i
              class="fas"
              :class="
                chapter.saved ? 'fa-bookmark text-primary' : 'fa-bookmark'
              "
            ></i>
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
const emit = defineEmits(["update-chapter"]);

const toggleSave = (chapter) => {
  chapter.saved = !chapter.saved;
  emit("update-chapter", chapter);
};
</script>
