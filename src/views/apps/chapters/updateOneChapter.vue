<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="kt_update_chapter_form"
      @submit="onUpdateChapter"
      :validation-schema="chapterSchema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateChapter") }}
        </h1>
      </div>

      <!-- Comic Name -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("comicName")
        }}</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="comicName"
          v-model="formValues.comicName"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="comicName" />
          </div>
        </div>
      </div>

      <!-- Chapter Name -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("chapterName")
        }}</label>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="chapterName"
          v-model="formValues.chapterName"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="chapterName" />
          </div>
        </div>
      </div>

      <!-- Chapter File Upload -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("chapterFile")
        }}</label>
        <el-upload
          v-model:file-list="formValues.chapterFiles"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          accept=".pdf,.zip"
          list-type="picture-card"
          :on-change="handleFileChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
        >
          <el-button type="primary">{{ $t("uploadChapter") }}</el-button>
          <template v-if="errorVal" #tip>
            <div class="el-upload__tip text-red-500">
              {{ $t("invalidFileError") }}
            </div>
          </template>
        </el-upload>
      </div>

      <!-- Website URL -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("websiteUrl")
        }}</label>
        <Field
          tabindex="3"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="websiteUrl"
          v-model="formValues.websiteUrl"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="websiteUrl" />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="4"
          type="submit"
          ref="submitButton"
          id="kt_update_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateChapter") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>

    <!-- File Preview Dialog -->
    <el-dialog v-model="dialogVisible">
      <img
        v-if="isImage(dialogFileType)"
        w-full
        :src="dialogImageUrl"
        alt="Preview Image"
      />
      <p v-else>{{ $t("unsupportedFilePreview") }}</p>
    </el-dialog>
  </div>
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";

const loading = ref(false);
const formValues = ref({
  chapterFiles: [],
});
const router = useRouter();
const route = useRoute();
const submitButton = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const dialogFileType = ref("");
const errorVal = ref(false);

const chapterSchema = Yup.object().shape({
  comicName: Yup.string()
    .required("Comic Name is required")
    .label("Comic Name"),
  chapterName: Yup.string()
    .required("Chapter Name is required")
    .label("Chapter Name"),
  websiteUrl: Yup.string()
    .url("Invalid URL format")
    .required("Website URL is required")
    .label("Website URL"),
});

// Fetch chapter details
const fetchChapterDetails = async () => {
  const { id } = route.params;

  try {
    loading.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/chapters/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok && data) {
      formValues.value = { ...data, chapterFiles: [] };
    } else {
      throw new Error(data?.message || "Failed to fetch chapter details.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Go Back",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    }).then(() => {
      router.push({ name: "apps-chapters-all" });
    });
  } finally {
    loading.value = false;
  }
};

const handleFileChange = (file) => {
  if (file.size / 1024 / 1024 > 5) {
    errorVal.value = true;
    return false;
  }
  errorVal.value = false;
  dialogFileType.value = file.raw.type;
  return true;
};

const handleRemove = () => {
  errorVal.value = false;
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogFileType.value = uploadFile.raw.type;
  dialogVisible.value = true;
};

const isImage = (fileType) => {
  return fileType.startsWith("image/");
};

const onUpdateChapter = async (values) => {
  const { id } = route.params;

  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    const formDataToSend = {
      ...values,
    };

    if (formValues.value.chapterFiles.length > 0) {
      const file = formValues.value.chapterFiles[0].raw;
      formDataToSend.file_data = await convertFileToBase64(file);
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/chapters/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formDataToSend),
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Chapter successfully updated!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-chapters-all" });
      });
    } else {
      throw new Error(data?.message || "Failed to update chapter.");
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

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

fetchChapterDetails();
</script>
