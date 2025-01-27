<template>
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="kt_update_genre_form"
      @submit="onSubmitUpdate"
      :validation-schema="updateSchema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateGenre") }}
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
            v-model="genreData.name[lang.code]"
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
          id="kt_update_genre_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateGenre") }}</span>
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
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const submitButton = ref(null);

const { t } = useI18n();

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

// Genre data
const genreData = reactive({
  name: {},
});

// Validation schema
const updateSchema = Yup.object().shape(
  Object.fromEntries(
    languages.flatMap(({ code }) => [
      [`name_${code}`, Yup.string().required(t("nameRequired"))],
    ]),
  ),
);

// Fetch genre details on mount
onMounted(async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/genres/${route.params.updateGenre}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok && data?.data) {
      const genre = data.data;

      languages.forEach(({ code }) => {
        genreData.name[code] = genre.name[code] || "";
      });

      loading.value = false;
    } else {
      throw new Error(data?.message || t("fetchFailed"));
    }
  } catch (error) {
    Swal.fire({
      text: error.message,
      icon: "error",
      buttonsStyling: true,
      confirmButtonText: t("tryAgain"),
    });
    loading.value = false;
  }
});

// Submit function
const onSubmitUpdate = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    const payload = {
      name: {},
    };

    languages.forEach(({ code }) => {
      payload.name[code] = values[`name_${code}`];
    });

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/genres/${route.params.updateGenre}`,
      {
        method: "PUT",
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
        text: data.message || t("genreUpdated"),
        icon: "success",
        buttonsStyling: true,
        confirmButtonText: t("okGotIt"),
      }).then(() => {
        router.replace({ name: "apps-genres-all" });
      });
    } else {
      throw new Error(data?.message || t("updateFailed"));
    }
  } catch (error) {
    Swal.fire({
      text: error.message,
      icon: "error",
      buttonsStyling: true,
      confirmButtonText: t("tryAgain"),
    });
  } finally {
    if (submitButton.value) {
      submitButton.value.removeAttribute("data-kt-indicator");
      submitButton.value.disabled = false;
    }
  }
};
</script>
