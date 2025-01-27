<template>
  <!--begin::Wrapper-->
  <div class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full"
      id="kt_add_role_form"
      @submit="onSubmitRole"
      :validation-schema="roleSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("addRole") }}
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
          id="kt_add_role_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("addRole") }}</span>
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
  <!--end::Wrapper-->
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useFetch } from "@vueuse/core";

const router = useRouter();
const submitButton = ref(null);

// Create form validation schema
const roleSchema = Yup.object().shape({
  nameInArabic: Yup.string()
    .required("Name in Arabic is required")
    .label("Name in Arabic"),
  nameInEnglish: Yup.string()
    .required("Name in English is required")
    .label("Name in English"),
});

// Form submit function
const onSubmitRole = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    console.log(values.nameInEnglish, values.nameInArabic);
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/roles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          name: { en: values.nameInEnglish, ar: values.nameInArabic },
        }),
      },
    ).json();

    if (data.value.status) {
      Swal.fire({
        text: "Role successfully added!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-roles-all" });
      });
    } else {
      throw new Error(data.message || "Failed to add role");
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
    }
  }
};
</script>
