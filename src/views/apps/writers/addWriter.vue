<template>
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="kt_add_writer_form"
      @submit="onSubmit"
      :validation-schema="schema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("addWriter") }}
        </h1>
      </div>

      <!-- Names and Slugs in Multiple Languages -->
      <div v-for="lang in languages" :key="lang.code" class="mb-10">
        <h2 class="text-2xl capitalize font-bold text-gray-800">
          {{ $t(lang.lang) }}
        </h2>
        <hr class="w-full mb-4 bg-gray-800" />

        <!-- Name -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("name")
          }}</label>
          <Field
            :name="`name_${lang.code}`"
            class="form-control form-control-lg form-control-solid"
            type="text"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage :name="`name_${lang.code}`" />
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          ref="submitButton"
          id="kt_add_writer_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("addWriter") }}</span>
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
import { useI18n } from "vue-i18n";

const router = useRouter();
const loading = ref(false);
const submitButton = ref(null);

const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
  { lang: "chinese", code: "zh" },
  { lang: "indian", code: "hi" },
  { lang: "italian", code: "it" },
  { lang: "spanish", code: "es" },
  { lang: "russian", code: "ru" },
  { lang: "turkish", code: "tr" },
  { lang: "french", code: "fr" },
  { lang: "german", code: "de" },
];

// Validation schema
const schema = Yup.object().shape({
  ...Object.fromEntries(
    languages.flatMap(({ code }) => [
      [`name_${code}`, Yup.string().required("Name is required")],
    ]),
  ),
});

// Submit form
const onSubmit = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    // Prepare payload
    const payload = {
      name: {},
    };

    // Add multilingual fields
    languages.forEach(({ code }) => {
      payload.name[code] = values[`name_${code}`];
    });

    // Make API request
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/writers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Writer successfully added!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-writers-all" });
      });
    } else {
      throw new Error(data?.message || "Failed to add writer.");
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
