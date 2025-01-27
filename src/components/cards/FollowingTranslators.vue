<template>
  <div :class="cardClasses">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("followingTranslators") }}</h3>
        <p class="text-muted my-auto">
          {{ $t("translatorsYouAreFollowing") }}.
        </p>
      </div>
      <div class="card-body">
        <div
          v-for="translator in data"
          :key="translator.id"
          class="d-flex align-items-center mb-5"
        >
          <div class="flex-grow-1">
            <div class="fw-bold fs-5">{{ translator.name }}</div>
            <div class="text-muted">{{ translator.language }}</div>
          </div>
          <button
            class="btn btn-icon btn-light btn-sm"
            @click="toggleFollow(translator)"
          >
            <i
              class="fas"
              :class="
                translator.followed
                  ? 'fa-user-minus text-danger'
                  : 'fa-user-plus text-success'
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

const emit = defineEmits(["update-follow"]);

const toggleFollow = (translator) => {
  translator.followed = !translator.followed;
  emit("update-follow", translator);
};
</script>
