<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-full lg:w-1/2 lg:p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="w-full lg:w-[500px] p-10">
          <router-view></router-view>
        </div>
        <!--end::Wrapper-->
      </div>
    </div>
    <!--end::Body-->

    <!--begin::Aside-->
    <div
      class="d-none d-lg-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"
      :style="`background-image: url('${getAssetPath(
        './media/misc/auth-bg.png',
      )}')`"
    >
      <!--begin::Content-->
      <div
        class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100"
      >
        <!--begin::Logo-->
        <router-link to="/" class="mb-0 mb-lg-12">
          <img
            alt="Logo"
            :src="getAssetPath('logo.png')"
            class="h-130px h-lg-150px"
          />
        </router-link>
        <!--end::Logo-->

        <!--begin::Image-->
        <img
          class="d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20"
          :src="getAssetPath('media/misc/auth-screens.png')"
          alt="img"
        />
        <!--end::Image-->

        <!--begin::Title-->
        <h1
          class="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7"
        >
          {{ $t("Fast") }}, {{ $t("Efficient and Productive") }}
        </h1>
        <!--end::Title-->

        <!--begin::Text-->
        <div class="d-none d-lg-block text-white fs-base text-center">
          {{ $t("In this kind of post") }},
          <a href="#" class="opacity-75-hover text-warning fw-bold me-1">{{
            $t("the blogger")
          }}</a>

          {{ $t("introduces a person they’ve interviewed") }} <br />
          {{ $t("and provides some background information about") }}

          <a href="#" class="opacity-75-hover text-warning fw-bold me-1">{{
            $t("the interviewee")
          }}</a>
          {{ $t("and their") }} <br />
          {{ $t("work following this is a transcript of the interview.") }}
        </div>
        <!--end::Text-->
      </div>
      <!--end::Content-->
    </div>
    <router-link
      to="/"
      class="mb-0 py-8 mb-lg-12 d-flex justify-center dark:bg-black/50 d-lg-none"
    >
      <img
        alt="Logo"
        :src="getAssetPath('logo.png')"
        class="h-[120px]"
      />
    </router-link>
    <!--end::Aside-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      LayoutService.emptyElementClassesAndAttributes(document.body);

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bg-body");
    });

    return {
      getAssetPath,
    };
  },
});
</script>
