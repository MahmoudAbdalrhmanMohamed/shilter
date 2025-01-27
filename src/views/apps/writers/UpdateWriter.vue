<template>
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="kt_update_homeless_form"
      @submit="onSubmitUpdate"
      :validation-schema="updateSchema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateHomeless") }}
        </h1>
      </div>

      <!-- Address and Note Fields -->
      <div class="mb-10">
        <!-- Address -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("address")
          }}</label>
          <Field
            name="address"
            v-model="homelessData.address"
            class="form-control form-control-lg form-control-solid"
            type="text"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="address" />
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("note")
          }}</label>
          <Field
            name="note"
            v-model="homelessData.note"
            class="form-control form-control-lg form-control-solid"
            type="text"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="note" />
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-center">
        <button
          type="submit"
          ref="submitButton"
          id="kt_update_homeless_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateHomeless") }}</span>
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

// Homeless data
const homelessData = reactive({
  address: "",
  note: "",
});

// Validation schema
const updateSchema = Yup.object().shape({
  address: Yup.string().required(t("addressRequired")),
  note: Yup.string().nullable(),
});

// Fetch homeless details on mount
onMounted(async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${route.params.updateHomeless}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok && data?.data) {
      const homeless = data.data;

      homelessData.address = homeless.address || "";
      homelessData.note = homeless.note || "";

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
  loading.value = true;
  try {
    const payload = {
      address: values.address,
      note: values.note,
    };

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/homelesses/${route.params.updateHomeless}`,
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
        text: data.message || t("homelessUpdated"),
        icon: "success",
        buttonsStyling: true,
        confirmButtonText: t("okGotIt"),
      }).then(() => {
        router.replace({ name: "apps-homeless-all" });
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
      loading.value = false;
    }
  }
};
</script>
