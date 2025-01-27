<template>
  <div :class="cardClasses">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("savedComics") }}</h3>
        <p class="text-muted my-auto">
          {{ $t("yourCollectionOfSavedComics") }}.
        </p>
      </div>
      <div class="card-body">
        <div
          v-for="comic in data"
          :key="comic.id"
          class="d-flex align-items-center mb-5"
        >
          <img
            :src="comic.cover"
            alt="comic cover"
            class="w-80px h-100px rounded me-4"
          />
          <div class="flex-grow-1">
            <div class="fw-bold fs-5">{{ comic.title }}</div>
            <div class="text-muted">
              {{ comic.genre }} - {{ comic.publisher }}
            </div>
            <div class="mt-2">
              <span
                class="badge"
                :class="`badge-${comic.status === 'Active' ? 'success' : 'danger'}`"
              >
                {{ comic.status }}
              </span>
            </div>
          </div>
          <button
            class="btn btn-icon btn-light btn-sm"
            @click="toggleSave(comic)"
          >
            <i
              class="fas"
              :class="comic.saved ? 'fa-bookmark text-primary' : 'fa-bookmark'"
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

const emit = defineEmits(["update-comic"]);

const toggleSave = (comic) => {
  comic.saved = !comic.saved;
  emit("update-comic", comic);
};
</script>
