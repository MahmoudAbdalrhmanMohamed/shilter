<template>
  <!--begin::Wrapper-->
  <div v-if="!loading" class="md:p-10">
    <!--begin::Form-->
    <VForm
      class="form w-full flex flex-col"
      id="kt_update_publisher_form"
      @submit="onSubmitUpdate"
      :validation-schema="updateSchema"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updatePublisher") }}
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
          v-model="formValues.username"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="username" />
          </div>
        </div>
      </div>

      <!-- Logo Upload -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("logo")
        }}</label>
        <el-upload
          v-model:file-list="formValues.logoFiles"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          accept=".jpg,.png"
          list-type="picture-card"
          :on-change="handleLogoChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
        >
          <el-button type="primary">{{ $t("uploadLogo") }}</el-button>
          <template v-if="errorVal" #tip>
            <div class="el-upload__tip text-red-500">
              {{ $t("invalidImageError") }}
            </div>
          </template>
        </el-upload>
      </div>

      <!-- Language -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("language")
        }}</label>
        <Field name="language" v-slot="{ field }">
          <el-select
            v-model="formValues.language"
            v-bind="field"
            placeholder="Select Language"
            size="large"
            class="form-control-solid"
            :clearable="true"
            tabindex="3"
            name="language"
          >
            <el-option
              v-for="lang in languages"
              :key="lang"
              :label="lang"
              :value="lang"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="language" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Year -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("year")
        }}</label>
        <Field
          tabindex="4"
          class="form-control form-control-lg form-control-solid"
          type="number"
          name="year"
          v-model="formValues.year"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="year" />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("description")
        }}</label>
        <Field
          tabindex="5"
          as="textarea"
          class="form-control form-control-lg form-control-solid"
          name="description"
          v-model="formValues.description"
          rows="4"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="description" />
          </div>
        </div>
      </div>

      <!-- Rate -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("rate")
        }}</label>
        <Field
          tabindex="6"
          class="form-control form-control-lg form-control-solid"
          type="number"
          name="rate"
          v-model="formValues.rate"
          min="1"
          max="5"
          step="0.1"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="rate" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="7"
          type="submit"
          ref="submitButton"
          id="kt_update_publisher_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updatePublisher") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <!--end::Form-->
  </div>
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
  <!--end::Wrapper-->
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";

const loading = ref(true);
const router = useRouter();
const route = useRoute();
const submitButton = ref(null);

const formValues = ref({
  username: "",
  logoFiles: [],
  language: "",
  year: "",
  description: "",
  rate: null,
});

const languages = [
  "ar",
  "en",
  "chinese",
  "indian",
  "italian",
  "spanish",
  "russian",
  "turkish",
  "french",
  "german",
];

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const errorVal = ref(false);
const changeImg = ref(false); // Track if image is changed

// Fetch data immediately
(async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/publishers/${route.params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();
    if (response.ok && data.status) {
      const publisher = data.data;
      formValues.value = {
        username: publisher.username,
        logoFiles: publisher.logo
          ? [{ url: publisher.logo, name: "Uploaded", raw: null }]
          : [],
        language: publisher.language,
        year: publisher.year,
        description: publisher.description,
        rate: publisher.rate,
      };
    } else {
      throw new Error(data.message || "Failed to fetch publisher details.");
    }
    loading.value = false;
  } catch (error) {
    Swal.fire({
      text: error.message,
      icon: "error",
      confirmButtonText: "Try again!",
    });
    loading.value = false;
  }
})();

// Validation schema
const updateSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").label("Username"),
  logo: Yup.mixed().label("Logo"),
  language: Yup.string().required("Language is required").label("Language"),
  year: Yup.number().required("Year is required").label("Year"),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required")
    .label("Description"),
  rate: Yup.number()
    .min(1, "Rate must be at least 1")
    .max(5, "Rate cannot exceed 5")
    .required("Rate is required")
    .label("Rate"),
});

// Submit update function
const onSubmitUpdate = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    const payload = {
      username: values.username,
      language: values.language,
      year: values.year,
      description: values.description,
      rate: values.rate,
    };

    if (formValues.value.logoFiles.length > 0 && changeImg.value) {
      const file = formValues.value.logoFiles[0].raw;
      payload.image_file = await convertFileToBase64(file);
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/publishers/${route.params.id}`,
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
    if (response.ok && data.status) {
      Swal.fire({
        text: data.message || "Publisher successfully updated!",
        icon: "success",
        confirmButtonText: "Ok, got it!",
      }).then(() => router.push({ name: "apps-publishers-all" }));
    } else {
      throw new Error(data.message || "Failed to update publisher.");
    }
  } catch (error) {
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

// Convert file to Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Handlers for image upload
const handleLogoChange = (file) => {
  if (file.size / 1024 / 1024 > 1) {
    errorVal.value = true;
    return false;
  }
  errorVal.value = false;
  changeImg.value = true;
  return true;
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const handleRemove = () => {
  errorVal.value = false;
};
</script>
