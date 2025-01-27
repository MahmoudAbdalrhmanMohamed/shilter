<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="add_chapter_form"
      @submit="onSubmitChapters"
      :validation-schema="chapterSchema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("addChapters") }}
        </h1>
      </div>

      <!-- Comic Name Search and Select -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("comicName")
        }}</label>
        <Field v-slot="{ field }" name="selectedComic">
          <el-select
            v-model="selectedComic"
            filterable
            remote
            reserve-keyword
            placeholder="Search for a comic"
            :remote-method="searchComics"
            :loading="searchLoading"
            @change="onComicSelect"
            v-bind="field"
          >
            <el-option
              v-for="comic in comicOptions"
              :key="comic.id"
              :label="comic.full_name"
              :value="comic.id"
            />
          </el-select>
        </Field>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="selectedComic" />
          </div>
        </div>
      </div>

      <!-- Website Type -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("websiteType")
        }}</label>
        <Field v-slot="{ field }" name="websiteType">
          <el-select
            v-model="formValues.websiteType"
            filterable
            placeholder="Select website type"
            class="w-full"
            v-bind="field"
          >
            <el-option
              v-for="type in websiteTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </Field>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="websiteType" />
          </div>
        </div>
      </div>

      <!-- Start Chapter Number -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("startChapter")
        }}</label>
        <Field
          type="number"
          name="start"
          class="form-control form-control-lg form-control-solid"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="start" />
          </div>
        </div>
      </div>

      <!-- End Chapter Number -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("endChapter")
        }}</label>
        <Field
          type="number"
          name="end"
          class="form-control form-control-lg form-control-solid"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="end" />
          </div>
        </div>
      </div>

      <!-- Website URL -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("websiteUrl")
        }}</label>
        <Field
          type="text"
          name="websiteUrl"
          class="form-control form-control-lg form-control-solid"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="websiteUrl" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          type="submit"
          ref="submitButton"
          id="kt_add_chapter_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("addChapters") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>
  </div>

  <!-- Loading and Progress Bar -->
  <div v-else class="w-full h-screen grid place-items-center">
    <div class="text-center">
      <div class="progress-container">
        <!-- Circular Progress Bar -->
        <div class="relative w-32 h-32">
          <svg class="w-full h-full" viewBox="0 0 36 36">
            <!-- Background Circle -->
            <path
              class="text-gray-200 stroke-current"
              stroke-width="4"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <!-- Progress Circle -->
            <path
              class="text-blue-500 stroke-current"
              stroke-width="4"
              stroke-linecap="round"
              fill="none"
              :stroke-dasharray="`${progress}, 100`"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <!-- Progress Text -->
          <div
            class="absolute inset-0 flex items-center justify-center text-lg font-semibold"
          >
            {{ progress.toFixed(1) }}%
          </div>
        </div>

        <!-- Completion Message -->
        <p
          v-if="progress === 100"
          class="mt-4 text-green-500 font-semibold animate-pulse"
        >
          Completed! Redirecting...
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";

const userId = localStorage.getItem("id");
const router = useRouter();

const searchLoading = ref(false);
const comicOptions = ref([]);
const selectedComic = ref(null);
const loading = ref(false);
const submitButton = ref(null);
const progress = ref(0);

const websiteTypes = ref([{ value: "readcomic", label: "ReadComic" }]);

const formValues = ref({
  websiteType: "",
});

const searchComics = async (query) => {
  if (query.length < 4) return;
  searchLoading.value = true;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/search-translated-comics?name=${query}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();
    comicOptions.value = data.data;
  } catch (error) {
    console.error("Error searching comics:", error);
  } finally {
    searchLoading.value = false;
  }
};

const onComicSelect = (value) => {
  selectedComic.value = value;
};

// Validation schema
const chapterSchema = Yup.object().shape({
  selectedComic: Yup.number()
    .required("Comic Name is required")
    .label("Comic Name"),
  websiteType: Yup.string()
    .required("Website Type is required")
    .label("Website Type"),
  start: Yup.number()
    .required("Start Chapter is required")
    .label("Start Chapter"),
  end: Yup.number().required("End Chapter is required").label("End Chapter"),
  websiteUrl: Yup.string()
    .required("Website URL is required")
    .label("Website URL"),
});

// Submit chapters form
const onSubmitChapters = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    const formDataToSend = {
      translated_comic_id: selectedComic.value,
      type: formValues.value.websiteType,
      start: values.start,
      end: values.end,
      url: values.websiteUrl,
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/chapter-create/all`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formDataToSend),
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Chapters successfully added!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      });
    } else {
      throw new Error(data?.message || "Failed to add chapters.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Try again!",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
    loading.value = false;
  } finally {
    if (submitButton.value) {
      submitButton.value.removeAttribute("data-kt-indicator");
      submitButton.value.disabled = false;
      loading.value = false;
    }
  }
};

// Pusher setup
import Echo from "laravel-echo";
import Pusher from "pusher-js";
Pusher.logToConsole = true;
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "03594b985c5c9701cb47",
  cluster: "eu",
  forceTLS: true,
});

const channel = window.Echo.channel(`scraping.progress.admin.all.${userId}`);

// Listen for progress updates
channel.listen(".progress.all", (data) => {
  if (data?.progress !== undefined) {
    progress.value = data.progress;
    console.log("Progress updated:", data.progress);
  }
});

// Watch for progress to reach 100%
watch(progress, (newProgress) => {
  if (newProgress === 100) {
    router.push({ name: "apps-chapters-all" });
  }
});
</script>
<style scoped>
/* Circular Progress Bar Animation */
@keyframes progressAnimation {
  0% {
    stroke-dasharray: 0 100;
  }
}

.progress-container svg path {
  transition: stroke-dasharray 0.5s ease-in-out;
}

/* Pulsating Effect for Completion */
.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
