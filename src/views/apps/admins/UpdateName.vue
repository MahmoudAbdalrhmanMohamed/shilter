<template>
  <!--begin::Wrapper-->
  <div v-if="!loading" class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full"
      id="kt_update_name_form"
      @submit="onSubmitRole"
      :validation-schema="roleSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateName") }}
        </h1>
      </div>

      <!-- Name in Arabic -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("name")
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

      <!-- Email Field -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("email")
        }}</label>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="email"
          name="email"
          v-model="roleData.email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
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
          <span v-if="!loading" class="indicator-label">{{
            $t("updateName")
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

// Role data
const roleData = reactive({
  nameInArabic: "",
  email: "",
});

// Validation schema
const roleSchema = Yup.object().shape({
  nameInArabic: Yup.string()
    .required("Name in Arabic is required")
    .label("Name in Arabic"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .label("Email"),
});
const fetchData = async () => {
  try {
    loading.value = true;
    const response = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/auth/info`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    roleData.nameInArabic = response.data?.value?.data.username;
    roleData.email = response.data?.value?.data.email;
    loading.value = false;
  } catch (error) {
    loading.value = false;

    console.error("Error fetching data:", error);
  }
};

fetchData();

// Submit function
const onSubmitRole = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    const response = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/auth/info`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          username: values.nameInArabic,
          email: values.email,
        }),
      },
    ).json();

    // Ensure proper response handling
    if (response.data?.value?.status) {
      Swal.fire({
        text: "successfully updated!",
        icon: "success",
        confirmButtonText: "Ok, got it!",
      }).then(() => {
        localStorage.removeItem("authToken");
        router.push("/sign-in");
      });
    } else {
      throw new Error(
        response.data?.value?.message || "Failed to update role.",
      );
    }
  } catch (error) {
    Swal.fire({
      text: "Something went wrong!",
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
