<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <div class="text-center mb-10">
      <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
        {{ $t("updateAllChapters") }}
      </h1>
    </div>

    <!-- Form -->
    <VForm
      class="form w-full"
      id="update_all_chapters_form"
      @submit="onSubmitAllChapters"
      :validation-schema="chapterSchema"
    >
      <div
        v-for="(chapter, index) in chapters"
        :key="index"
        class="mb-5 p-5 border rounded"
      >
        <h3 class="text-gray-700 text-lg font-semibold mb-3">
          {{ $t("chapter") }} {{ index + 1 }}
        </h3>

        <!-- Comic Name -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("comicName")
          }}</label>
          <Field
            tabindex="1"
            class="form-control form-control-lg form-control-solid"
            type="text"
            v-model="chapters[index].comicName"
            name="comicName"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="comicName" />
            </div>
          </div>
        </div>

        <!-- Website URL -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("websiteUrl")
          }}</label>
          <Field
            tabindex="2"
            class="form-control form-control-lg form-control-solid"
            type="text"
            v-model="chapters[index].websiteUrl"
            name="websiteUrl"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="websiteUrl" />
            </div>
          </div>
        </div>

        <!-- Chapter URL -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("chapterUrl")
          }}</label>
          <Field
            tabindex="3"
            class="form-control form-control-lg form-control-solid"
            type="text"
            v-model="chapters[index].chapterUrl"
            name="chapterUrl"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="chapterUrl" />
            </div>
          </div>
        </div>

        <!-- Start -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("start")
          }}</label>
          <Field
            tabindex="4"
            class="form-control form-control-lg form-control-solid"
            type="number"
            v-model="chapters[index].start"
            name="start"
            min="0"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="start" />
            </div>
          </div>
        </div>

        <!-- End -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("end")
          }}</label>
          <Field
            tabindex="5"
            class="form-control form-control-lg form-control-solid"
            type="number"
            v-model="chapters[index].end"
            name="end"
            min="0"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="end" />
            </div>
          </div>
        </div>

        <!-- Chapter Uploader -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("chapterUploader")
          }}</label>
          <Field
            tabindex="6"
            class="form-control form-control-lg form-control-solid"
            type="text"
            v-model="chapters[index].chapterUploader"
            name="chapterUploader"
            autocomplete="off"
          />
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="chapterUploader" />
            </div>
          </div>
        </div>

        <!-- File Upload -->
        <div class="fv-row mb-5">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("chapterFile")
          }}</label>
          <el-upload
            v-model:file-list="chapters[index].fileList"
            class="upload-demo"
            :limit="1"
            :auto-upload="false"
            accept=".pdf,.zip"
            list-type="picture-card"
            :on-change="handleFileChange(index)"
            :on-preview="handlePreview"
            :on-remove="handleRemove(index)"
          >
            <el-button type="primary">{{ $t("uploadFile") }}</el-button>
          </el-upload>
        </div>
      </div>

      <!-- Submit -->
      <div class="text-center">
        <button
          tabindex="7"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateChapters") }}</span>
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
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";

const loading = ref(false);
const router = useRouter();
const route = useRoute();
const submitButton = ref(null);

// Form data for multiple chapters
const chapters = ref([]);

// Validation schema for the form
const chapterSchema = Yup.array()
  .of(
    Yup.object().shape({
      comicName: Yup.string().required("Comic Name is required"),
      websiteUrl: Yup.string()
        .url("Invalid URL format")
        .required("Website URL is required"),
      chapterUrl: Yup.string()
        .url("Invalid URL format")
        .required("Chapter URL is required"),
      start: Yup.number()
        .required("Start is required")
        .min(0, "Start must be at least 0"),
      end: Yup.number()
        .required("End is required")
        .min(0, "End must be at least 0"),
      chapterUploader: Yup.string().required("Chapter Uploader is required"),
    }),
  )
  .required("At least one chapter is required");

// Fetch existing chapters
const fetchChapters = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/chapters/bulk/${route.params.id}`,
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
      chapters.value = data.chapters.map((chapter) => ({
        ...chapter,
        fileList: [], // Initialize file list for each chapter
      }));
    } else {
      throw new Error(data?.message || "Failed to fetch chapters.");
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

// File change handlers
const handleFileChange = (index) => (file) => {
  if (file.size / 1024 / 1024 > 5) {
    Swal.fire({
      text: "File size cannot exceed 5 MB.",
      icon: "warning",
    });
    return false;
  }
  return true;
};

const handleRemove = (index) => () => {
  chapters.value[index].fileList = [];
};

const handlePreview = (uploadFile) => {
  const fileUrl = uploadFile.url || URL.createObjectURL(uploadFile.raw);
  window.open(fileUrl, "_blank");
};

// Submit updated chapters
const onSubmitAllChapters = async () => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    // Convert file uploads to base64
    const chaptersData = await Promise.all(
      chapters.value.map(async (chapter) => {
        const fileData =
          chapter.fileList.length > 0
            ? await convertFileToBase64(chapter.fileList[0].raw)
            : null;

        return {
          ...chapter,
          fileData,
        };
      }),
    );

    // Send the form data
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/chapters/bulk/${route.params.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ chapters: chaptersData }),
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Chapters successfully updated!",
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
      throw new Error(data?.message || "Failed to update chapters.");
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

// Convert file to base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

fetchChapters();
</script>
