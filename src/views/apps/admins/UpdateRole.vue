<template>
  <!--begin::Wrapper-->
  <div v-if="!loading" class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full"
      id="kt_update_role_form"
      @submit="onSubmitRole"
      :validation-schema="roleSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateRole") }}
        </h1>
      </div>

      <!-- Name in Arabic -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("nameInArabic")
        }}</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="nameInArabic"
          v-model="roleData.nameInArabic"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="nameInArabic" />
          </div>
        </div>
      </div>

      <!-- Name in English -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("nameInEnglish")
        }}</label>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="nameInEnglish"
          v-model="roleData.nameInEnglish"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="nameInEnglish" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_update_role_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateRole") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>
    <!--end::Form-->
  </div>
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
  <!--end::Wrapper-->
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useFetch } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const submitButton = ref(null);
const loading = ref(false);

// Role data
const roleData = reactive({
  nameInArabic: "",
  nameInEnglish: "",
});

// Fetching role data for both languages
const fetchRoleData = async () => {
  try {
    loading.value = true;
    const { data: responseAr } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/roles/${route.params.updateRole}`,
      {
        method: "GET",
        headers: {
          "X-localization": "ar",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    const { data: responseEn } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/roles/${route.params.updateRole}`,
      {
        method: "GET",
        headers: {
          "X-localization": "en",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    if (responseAr.value?.status && responseEn.value?.status) {
      roleData.nameInArabic = responseAr.value.data.name || "";
      roleData.nameInEnglish = responseEn.value.data.name || "";
      loading.value = false;
    } else {
      throw new Error("Failed to fetch role data.");
    }
  } catch (error) {
    loading.value = false;

    Swal.fire({
      text: "Failed to fetch role data. Please try again.",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Ok",
    });
  }
};

// Fetch role data on mount
onMounted(fetchRoleData);

// Validation schema
const roleSchema = Yup.object().shape({
  nameInArabic: Yup.string()
    .required("Name in Arabic is required")
    .label("Name in Arabic"),
  nameInEnglish: Yup.string()
    .required("Name in English is required")
    .label("Name in English"),
});

// Submit function
const onSubmitRole = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/roles/${route.params.updateRole}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          name: {
            en: values.nameInEnglish,
            ar: values.nameInArabic,
          },
        }),
      },
    ).json();

    if (data.value && data.value.status) {
      Swal.fire({
        text: "Role successfully updated!",
        icon: "success",
        buttonsStyling: true,
        confirmButtonText: "Ok, got it!",
      }).then(() => {
        router.replace({ name: "apps-roles-all" });
      });
    } else {
      throw new Error(data.message || "Failed to update role.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Try again!",
    });
  } finally {
    if (submitButton.value) {
      submitButton.value.removeAttribute("data-kt-indicator");
      submitButton.value.disabled = false;
    }
  }
};
</script>
