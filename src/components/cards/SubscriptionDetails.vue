<template>
  <div :class="`card ${cardClasses}`">
    <div class="card-header border-0 pt-6">
      <h3 class="card-title">{{ $t("subscriptionDetails") }}</h3>
    </div>
    <div class="card-body pt-0">
      <ul class="list-group list-group-flush rounded-lg">
        <li class="list-group-item">
          <strong>{{ $t("plan") }}:</strong> {{ data.plan }}
        </li>
        <li class="list-group-item">
          <strong>{{ $t("renewalDate") }}:</strong> {{ data.renewal_date }}
        </li>
        <li class="list-group-item">
          <strong>{{ $t("status") }}:</strong>
          <span
            :class="[
              'badge',
              data.status === 'Active' ? 'badge-success' : 'badge-secondary',
            ]"
          >
            {{ data.status }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  cardClasses: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.list-group-item {
  border: none;
}
</style>
