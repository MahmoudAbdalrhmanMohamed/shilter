<template>
  <!--begin::Wrapper-->
  <div v-if="!loading" class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full flex flex-col"
      id="kt_update_admin_form"
      @submit="onSubmitUpdate"
      :validation-schema="updateSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateAdmin") }}
        </h1>
      </div>

      <!-- Username -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("username")
        }}</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="username"
          v-model="adminData.username"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>

      <!-- Email -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("email")
        }}</label>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="email"
          v-model="adminData.email"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>

      <!-- Password -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("password")
        }}</label>
        <Field
          tabindex="3"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("password_confirmation")
        }}</label>
        <Field
          tabindex="4"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password_confirmation"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password_confirmation" />
          </div>
        </div>
      </div>

      <!-- Role Dropdown -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("role")
        }}</label>
        <Field
          tabindex="5"
          as="select"
          class="form-select form-select-lg form-control-solid"
          name="role"
          v-model="adminData.role"
        >
          <option
            v-for="role in roles"
            :key="role.id"
            :value="role.id"
            :selected="role.id === adminData.role"
          >
            {{ role.name }}
          </option>
        </Field>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="role" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="6"
          type="submit"
          ref="submitButton"
          id="kt_update_admin_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateAdmin") }}</span>
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

const loading = ref(true);
const roles = ref([]);
const router = useRouter();
const route = useRoute();
const submitButton = ref(null);

// Admin data
const adminData = reactive({
  username: "",
  email: "",
  role: "",
});

// Fetch admin and roles data on mount
onMounted(async () => {
  try {
    // Fetch admin details
    const { data: adminResponse } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/admins/${route.params.updateAdmin}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    if (adminResponse.value?.data) {
      const admin = adminResponse.value.data;
      adminData.username = admin.username;
      adminData.email = admin.email;
      adminData.role = admin.role[0]?.id || ""; // Assume `role` is an array
    }

    // Fetch roles
    const { data: rolesResponse } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/roles`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    roles.value = rolesResponse.value?.data.data || [];
    loading.value = false;
  } catch (error) {
    Swal.fire({
      text: "Failed to fetch data. Please try again.",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Ok",
    });
    loading.value = false;
  }
});

// Validation schema
const updateSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").label("Username"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .label("Email"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .label("Password"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .label("Password Confirmation"),
  role: Yup.string().required("Role is required").label("Role"),
});

// Submit function
const onSubmitUpdate = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/admins/${route.params.updateAdmin}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(values),
      },
    ).json();

    if (data.value?.status) {
      Swal.fire({
        text: data.value.message,
        icon: "success",
        confirmButtonText: "Ok, got it!",
      }).then(() => {
        router.replace({ name: "apps-admins-all" });
      });
    } else if (data.value?.errors) {
      // Handle server-side validation errors
      const errors = data.value.errors;
      Object.entries(errors).forEach(([field, messages]) => {
        // Show errors dynamically
        VForm.setFieldError(field, messages.join(", "));
      });

      Swal.fire({
        text: data.value?.message || "Validation error occurred.",
        icon: "error",
        confirmButtonText: "Try again!",
      });
    } else {
      Swal.fire({
        text: data.value?.message || "Unexpected error occurred.",
        icon: "error",
        confirmButtonText: "Try again!",
      });
    }
  } catch (error) {
    console.error("Error occurred:", error); // Log the error
    Swal.fire({
      text: error.message,
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
