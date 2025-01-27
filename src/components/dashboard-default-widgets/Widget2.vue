<template>
  <div class="card card-flush" v-if="!loading" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{
          stats
        }}</span>
        <!--end::Amount-->

        <!--begin::Subtitle-->
        <span class="text-gray-500 pt-1 fw-semibold fs-6">{{
          description
        }}</span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body d-flex flex-column justify-content-end px-8">
      <!--begin::Title-->
      <span class="fs-6 fw-bolder text-gray-800 d-block mb-2">{{
        $t("today’sHeroes")
      }}</span>
      <!--end::Title-->
      <!--begin::Users group-->
      <div class="symbol-group symbol-hover flex-nowrap">
        <template v-for="item in dataVal.data.slice(0, 5)" :key="item.id">
          <router-link
            :to="`/apps/workshops/workshop/${item.id}`"
            class="symbol symbol-35px symbol-circle"
            data-bs-toggle="tooltip"
            :title="item.name"
          >
            <img alt="Pic" :src="item.image" />
          </router-link>
        </template>
        <router-link
          to="/apps/Workshops"
          class="symbol symbol-35px symbol-circle"
          data-bs-toggle="modal"
          data-bs-target="#kt_modal_view_users"
        >
          <span class="symbol-label bg-dark text-gray-300 fs-8 fw-bold"
            >+{{ dataVal.meta.total - 5 }}</span
          >
        </router-link>
      </div>
      <!--end::Users group-->
    </div>
    <!--end::Card body-->
  </div>
  <div class="w-full h-full grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { useFetch } from "@vueuse/core";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

// Props definition
defineProps({
  stats: { required: true },
  description: { type: String, required: true },
  className: { type: String, required: false },
  icon: { type: Boolean, default: false },
  labelColor: { type: String, default: "" },
  textColor: { type: String, default: "" },
});

const { locale } = useI18n();
const router = useRouter();
const loading = ref(false);
const dataVal = ref(null);
const isFetching = ref(false); // Prevent concurrent calls
const emit = defineEmits(["start", "end"]);

// Fetch data
const fetching = async () => {
  if (isFetching.value) return; // Prevent duplicate fetch calls
  isFetching.value = true;

  try {
    emit("start");
    loading.value = true;

    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshops`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    ).json();

    if (data.value.status) {
      dataVal.value = data.value.data;
    } else if (data.value.message === "Unauthenticated") {
      localStorage.removeItem("authToken");
      router.replace("/");
    } else {
      throw new Error(data.value.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    loading.value = false;
    emit("end");
    isFetching.value = false;
  }
};

// Initial fetch
fetching();

// Watch locale and refetch only when changed
watch(
  () => locale.value,
  async () => {
    await fetching();
  },
  { flush: "post" } // Prevents reactivity glitches
);
</script>
