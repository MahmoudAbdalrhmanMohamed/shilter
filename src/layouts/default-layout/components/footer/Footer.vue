<template>
  <!--begin::Footer-->
  <div v-if="footerDisplay" id="kt_app_footer" class="app-footer">
    <!--begin::Footer container-->
    <div
      class="app-container d-flex flex-column flex-md-row flex-center flex-md-stack py-3"
      :class="{
        'container-fluid': footerWidthFluid,
        'container-xxl': !footerWidthFluid,
      }"
    >
      <!--begin::Copyright-->
      <div class="text-gray-900 order-2 order-md-1">
        <span class="text-muted fw-semibold me-1">2024©</span>
        <a
          href="https://www.megatron-soft.com/"
          target="_blank"
          class="text-gray-800 text-hover-primary"
          >Megatron</a
        >
      </div>
      <!--end::Copyright-->
      <!--begin::Menu-->
      <ul class="menu menu-gray-600 menu-hover-primary fw-semibold order-1">
        <li class="menu-item">
          <a
            href="https://www.megatron-soft.com/about"
            target="_blank"
            class="menu-link px-2"
            >{{ $t("about") }}</a
          >
        </li>
        <li class="menu-item">
          <a
            href="https://www.megatron-soft.com/contact-us"
            target="_blank"
            class="menu-link px-2"
            >{{ $t("support") }}</a
          >
        </li>
      </ul>
      <!--end::Menu-->
    </div>
    <!--end::Footer container-->
  </div>
  <!--end::Footer-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  footerDisplay,
  footerWidthFluid,
} from "@/layouts/default-layout/config/helper";

export default defineComponent({
  name: "theme-footer",
  components: {},
  setup() {
    return {
      footerWidthFluid,
      footerDisplay,
    };
  },
});
</script>
