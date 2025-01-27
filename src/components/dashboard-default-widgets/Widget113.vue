<template>
  <div
    class="card test card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
    :class="className"
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
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  className: { type: String, required: false },
  usersCount: { type: String, required: false },
  usersCount: { required: false },
  usersVerifiedCount: { required: false },
  description: { type: String, required: true },
});
</script>

<style scoped>
.test {
  background: #654ea3; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #eaafc8,
    #654ea3
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #eaafc8,
    #654ea3
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
