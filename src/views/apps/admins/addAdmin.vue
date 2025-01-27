<template>
  <!--begin::Wrapper-->
  <div v-if="!loading" class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="loginSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("addAdmin") }}
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
      <!-- <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("role")
        }}</label>
        <Field
          tabindex="5"
          as="select"
          class="form-select form-select-lg form-control-solid"
          name="role"
        >
          <template v-if="roles?.data?.data">
            <option
              v-for="role in roles.data.data"
              :value="role.id"
              :key="role.id"
            >
              {{ role.name }}
            </option>
          </template>
        </Field>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="role" />
          </div>
        </div>
      </div> -->

      <!-- Role Dropdown -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("role")
        }}</label>
        <Field name="role" v-slot="{ field }">
          <el-select
            v-model="formValues.role"
            v-bind="field"
            placeholder="Select Role"
            size="large"
            class="form-control-solid"
            :clearable="true"
            tabindex="5"
            name="role"
          >
            <el-option
              v-for="role in roles?.data?.data"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="role" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="6"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("addAdmin") }}</span>
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useFetch } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const roles = ref(null);
const loading = ref(true);
const router = useRouter();
const submitButton = ref(null);
const formValues = ref({
  role: "",
});

// Create form validation schema
const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").label("Username"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required")
    .label("Email"),
  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required")
    .label("Password"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required")
    .label("Password Confirmation"),
  role: Yup.string().required("Role is required").label("Role"),
});

// Form submit function
const onSubmitLogin = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    // Make the API request using fetch
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/admins`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(values),
      },
    );

    // Parse the JSON response
    const data = await response.json();

    // Handle the success case
    if (data?.status) {
      loading.value = false;
      Swal.fire({
        text: data.message || "Admin successfully added!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-admins-all" });
      });
    } else {
      loading.value = false;
      // Handle the error case
      Swal.fire({
        text: data?.message || "Failed to add admin.",
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Try again!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-danger",
        },
      });
    }
  } catch (error) {
    loading.value = false;
    // Catch and display errors
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

const fetchRoles = async () => {
  const { data } = await useFetch(
    `${import.meta.env.VITE_APP_API_URL_MEGATRON}/roles`,
    {
      method: "GET",
      headers: {
        "X-localization": locale.value,
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    },
  ).json();
  roles.value = data.value;
  loading.value = false;
};

fetchRoles();
</script>
