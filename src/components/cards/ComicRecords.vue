<template>
  <div :class="`card ${cardClasses}`">
    <div class="card-header border-0 pt-6">
      <h3 class="card-title">{{ $t("comicsRecords") }}</h3>
    </div>
    <div class="card-body pt-0">
      <div v-if="data.length" class="row">
        <div
          v-for="comic in data"
          :key="comic.id"
          class="col-lg-6 col-md-12 mb-4"
        >
          <div class="card shadow-sm h-100">
            <img :src="comic.cover" alt="Comic Cover" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ comic.title }}</h5>
              <p class="card-text">
                <strong>{{ $t("genre") }}:</strong> {{ comic.genre }}
              </p>
              <p class="card-text">
                <strong>{{ $t("publisher") }}:</strong> {{ comic.publisher }}
              </p>
              <p class="card-text">
                <strong>{{ $t("status") }}:</strong>
                <span
                  :class="[
                    'badge',
                    comic.status === 'Active'
                      ? 'badge-success'
                      : comic.status === 'Completed'
                        ? 'badge-primary'
                        : 'badge-secondary',
                  ]"
                >
                  {{ comic.status }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-center">{{ $t("noComicsAvailable") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  cardClasses: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.card-img-top {
  height: 150px;
  object-fit: cover;
}
</style>
