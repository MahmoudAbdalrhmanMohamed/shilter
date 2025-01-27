<template>
  <!--begin::Card-->
  <p class="mt-4 mb-1 text-lg font-semibold md:text-2xl">
    {{ $t("workshop") }}
  </p>
  <div :class="`card pt-4 ${cardClasses}`">
    <!--begin::Card header-->

    <div class="card-body pt-4">
      <div class="fw-bold fs-2 space-y-4">
        <p class="text-center capitalize">
          {{ props.data.name }}
        </p>
        <div class="fs-7 fw-normal text-muted grid place-items-center">
          {{ `${$t("workshopDescription")}: ${props.data.description}` }}
        </div>
        <div class="text-base md:text-lg grid place-items-center">
          {{ `${$t("workshopAddress")}: ${props.data.address}` }}
        </div>
      </div>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script setup>
const props = defineProps({
  cardClasses: String,
  data: Object,
});
</script>
