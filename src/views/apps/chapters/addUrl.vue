<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <div class="text-center mb-10">
      <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
        {{ $t("insertUrl") }}
      </h1>
    </div>

    <!-- Form -->
    <VForm
      class="form w-full"
      id="insert_url_form"
      @submit="onSubmitUrl"
      :validation-schema="urlSchema"
    >
      <div
        v-for="(url, index) in urls"
        :key="index"
        class="mb-5 p-5 border rounded"
      >
        <h3 class="text-gray-700 text-lg font-semibold mb-3">
          {{ $t("urlEntry") }} {{ index + 1 }}
        </h3>

        <!-- Comic Name -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("comicName")
          }}</label>
          <Field
            tabindex="1"
            class="form-control form-control-lg form-control-solid"
            type="text"
            v-model="urls[index].comicName"
            name="comicName"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="comicName" />
            </div>
          </div>
        </div>

        <!-- URL -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("url")
          }}</label>
          <Field
            tabindex="2"
            class="form-control form-control-lg form-control-solid"
            type="text"
            v-model="urls[index].url"
            name="url"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="url" />
            </div>
          </div>
        </div>

        <!-- Start -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("start")
          }}</label>
          <Field
            tabindex="3"
            class="form-control form-control-lg form-control-solid"
            type="number"
            v-model="urls[index].start"
            name="start"
            min="0"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="start" />
            </div>
          </div>
        </div>

        <!-- End -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("end")
          }}</label>
          <Field
            tabindex="4"
            class="form-control form-control-lg form-control-solid"
            type="number"
            v-model="urls[index].end"
            name="end"
            min="0"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="end" />
            </div>
          </div>
        </div>

        <!-- Remove URL -->
        <div v-if="urls.length > 1" class="text-right">
          <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="removeUrl(index)"
          >
            {{ $t("removeUrl") }}
          </button>
        </div>
      </div>

      <!-- Add URL -->
      <div class="text-center mb-5">
        <button type="button" class="btn btn-sm btn-secondary" @click="addUrl">
          {{ $t("addMoreUrls") }}
        </button>
      </div>

      <!-- Submit -->
      <div class="text-center">
        <button
          tabindex="5"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("insertUrls") }}</span>
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
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";

const loading = ref(false);
const router = useRouter();
const submitButton = ref(null);

// Form data for multiple URLs
const urls = ref([
  {
    comicName: "",
    url: "",
    start: null,
    end: null,
  },
]);

// Validation schema for the form
const urlSchema = Yup.array()
  .of(
    Yup.object().shape({
      comicName: Yup.string().required("Comic Name is required"),
      url: Yup.string().url("Invalid URL format").required("URL is required"),
      start: Yup.number()
        .required("Start is required")
        .min(0, "Start must be at least 0"),
      end: Yup.number()
        .required("End is required")
        .min(0, "End must be at least 0"),
    }),
  )
  .required("At least one URL entry is required");

// Add a new URL entry
const addUrl = () => {
  urls.value.push({
    comicName: "",
    url: "",
    start: null,
    end: null,
  });
};

// Remove a URL entry
const removeUrl = (index) => {
  urls.value.splice(index, 1);
};

// Submit all URLs
const onSubmitUrl = async () => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    // Send the form data
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/urls/bulk`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ urls: urls.value }),
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "URLs successfully inserted!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-urls-all" });
      });
    } else {
      throw new Error(data?.message || "Failed to insert URLs.");
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
  } finally {
    if (submitButton.value) {
      submitButton.value.removeAttribute("data-kt-indicator");
      submitButton.value.disabled = false;
      loading.value = false;
    }
  }
};
</script>
