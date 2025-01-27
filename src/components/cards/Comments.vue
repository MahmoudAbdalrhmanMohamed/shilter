<template>
  <div :class="cardClasses">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t("comments") }}</h3>
        <p class="text-muted my-auto">{{ $t("yourRecentComments") }}.</p>
      </div>
      <div class="card-body">
        <div
          v-for="comment in data"
          :key="comment.id"
          class="flex items-center mb-5"
        >
          <div class="flex-grow-1">
            <div class="fw-bold fs-5">{{ comment.comicTitle }}</div>
            <div class="text-muted">{{ comment.comment }}</div>
            <div class="text-muted small">{{ comment.date }}</div>
          </div>
          <button
            class="btn btn-icon btn-light btn-sm mt-2"
            @click="deleteComment(comment)"
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

const emit = defineEmits(["delete-comment"]);

const deleteComment = (comment) => {
  emit("delete-comment", comment);
};
</script>
