<template>
  <!--begin::Wrapper-->
  <div v-if="!loading" class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full"
      id="kt_update_password_form"
      @submit="onSubmitPassword"
      :validation-schema="passwordSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updatePassword") }}
        </h1>
      </div>

      <!-- Current Password -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("currentPassword")
        }}</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="currentPassword"
          v-model="passwordData.currentPassword"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="currentPassword" />
          </div>
        </div>
      </div>

      <!-- New Password -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("newPassword")
        }}</label>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="newPassword"
          v-model="passwordData.newPassword"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="newPassword" />
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("confirmPassword")
        }}</label>
        <Field
          tabindex="3"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="confirmPassword"
          v-model="passwordData.confirmPassword"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="confirmPassword" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="4"
          type="submit"
          ref="submitButton"
          id="kt_update_password_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span v-if="!loading" class="indicator-label">{{
            $t("updatePassword")
          }}</span>
          <span v-else class="indicator-progress">
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
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useFetch } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const router = useRouter();
const submitButton = ref(null);
const loading = ref(false);

// Password data
const passwordData = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Validation schema
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .label("Current Password"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .label("New Password"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .label("Confirm Password"),
});

// Submit function
const onSubmitPassword = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    const response = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/auth/password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          password_current: values.currentPassword,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        }),
      },
    ).json();

    // Ensure proper response handling
    if (response.data?.value?.status) {
      Swal.fire({
        text: "Password updated successfully!",
        icon: "success",
        confirmButtonText: "Ok, got it!",
      }).then(() => {
        localStorage.removeItem("authToken");
        router.push("/sign-in");
      });
    } else {
      throw new Error(
        response.data?.value?.message || "Failed to update password.",
      );
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
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
