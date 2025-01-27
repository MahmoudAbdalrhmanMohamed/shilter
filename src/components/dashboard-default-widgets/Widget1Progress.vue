<template>
  <div
    class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
    :class="className"
    :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }"
  >
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">{{
          usersCount
        }}</span>
        <!--end::Amount-->

        <!--begin::Subtitle-->
        <span class="text-white opacity-50 pt-1 fw-semibold fs-6">{{
          description
        }}</span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body d-flex align-items-end pt-8 pb-24">
      <div class="d-flex align-items-center flex-column mt-3 w-100">
        <div
          class="d-flex justify-content-between fw-bold fs-6 text-white opacity-50 w-100 mt-auto mb-2"
        >
          <span>{{ usersVerifiedCount }} {{ $t(tanslated) }}</span>
          <span>{{ (usersVerifiedCount / usersCount).toFixed(2) * 100 }}%</span>
        </div>

        <div class="h-8px mx-3 w-100 bg-white bg-opacity-50 rounded">
          <div
            class="bg-white rounded h-8px"
            role="progressbar"
            :style="`width: ${(usersVerifiedCount / usersCount) * 100}%`"
            aria-valuenow="50"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  className: { type: String, required: false },
  bgColor: { type: String, required: false, default: "#080655" },
  bgImage: { type: String, required: false },
  usersCount: { type: String, required: false },
  usersCount: { required: false },
  usersVerifiedCount: { required: false },
  description: { type: String, required: true },
  tanslated: { type: String, required: false, default: "active" },
});
</script>
