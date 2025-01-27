<template>
  <div v-if="!loading" class="md:p-10">
    <div class="text-center mb-10">
      <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
        {{ $t("uploadZipFile") }}
      </h1>
    </div>

    <!-- Form -->
    <el-form
      :model="formValues"
      :rules="zipSchema"
      ref="formRef"
      class="form w-full"
    >
      <!-- Comic Name -->
      <el-form-item prop="comicName">
        <label class="form-label fs-6 fw-bold required text-gray-900">{{
          $t("comicName")
        }}</label>
        <el-input
          v-model="formValues.comicName"
          autocomplete="off"
          class="w-full bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
          size="large"
        />
      </el-form-item>

      <!-- Chapter Name -->
      <el-form-item prop="chapterName">
        <label class="form-label fs-6 fw-bold required text-gray-900">{{
          $t("chapterName")
        }}</label>
        <el-input
          v-model="formValues.chapterName"
          autocomplete="off"
          class="w-full bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
          size="large"
        />
      </el-form-item>

      <!-- Date Picker -->
      <el-form-item prop="date">
        <label class="form-label fs-6 fw-bold required text-gray-900">{{
          $t("Date")
        }}</label>
        <el-date-picker
          v-model="formValues.date"
          type="date"
          placeholder="Select a date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          size="large"
          class="w-full"
        />
      </el-form-item>

      <!-- Start -->
      <el-form-item prop="start">
        <label class="form-label fs-6 fw-bold required text-gray-900">{{
          $t("start")
        }}</label>
        <el-input-number v-model="formValues.start" :min="0" class="w-full" />
      </el-form-item>

      <!-- End -->
      <el-form-item prop="end">
        <label class="form-label fs-6 fw-bold required text-gray-900">{{
          $t("end")
        }}</label>
        <el-input-number v-model="formValues.end" :min="0" class="w-full" />
      </el-form-item>

      <!-- ZIP Upload -->
      <el-form-item prop="file">
        <label class="form-label fs-6 fw-bold required text-gray-900">{{
          $t("uploadZip")
        }}</label>
        <el-upload
          :file-list="fileList"
          :limit="1"
          :auto-upload="false"
          accept=".zip"
          list-type="text"
          :on-change="handleFileChange"
          class="w-full"
        >
          <el-button type="primary">{{ $t("uploadZip") }}</el-button>
        </el-upload>
        <div v-if="fileError" class="text-red-500">{{ fileError }}</div>
      </el-form-item>

      <!-- Submit Button -->
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmitZip"
          :loading="loading"
          class="w-full h-16 text-lg md:text-2xl"
        >
          {{ $t("uploadZipFile") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- Loader -->
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import {
  ElForm,
  ElInput,
  ElInputNumber,
  ElDatePicker,
  ElUpload,
  ElButton,
} from "element-plus";

const loading = ref(false);
const router = useRouter();
const formRef = ref(null);
const fileList = ref([]);
const fileError = ref("");

// Form data
const formValues = ref({
  comicName: "",
  chapterName: "",
  date: "",
  start: null,
  end: null,
});

// Validation schema
const zipSchema = {
  comicName: [
    { required: true, message: "Comic Name is required", trigger: "blur" },
  ],
  chapterName: [
    { required: true, message: "Chapter Name is required", trigger: "blur" },
  ],
  date: [{ required: true, message: "Date is required", trigger: "change" }],
  start: [
    { required: true, message: "Start is required", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "Start must be at least 0",
      trigger: "blur",
    },
  ],
  end: [
    { required: true, message: "End is required", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "End must be at least 0",
      trigger: "blur",
    },
  ],
  file: [
    { required: true, message: "ZIP file is required", trigger: "change" },
  ],
};

const allowedZipMimeTypes = [
  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",
  "application/x-compressed",
];

const handleFileChange = (file, fileList) => {
  // Update fileList
  fileList.value = fileList;

  // Validate file type against allowed MIME types
  if (file.raw && allowedZipMimeTypes.includes(file.raw.type)) {
    fileError.value = ""; // Clear any previous errors
    return true;
  } else {
    fileError.value = "Please upload a valid ZIP file.";
    fileList.value = []; // Reset file list if invalid
    return false;
  }
};

// Submit ZIP data
const onSubmitZip = async () => {
  fileError.value = "";

  // Validate the form
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    if (fileList.value.length === 0) {
      fileError.value = "ZIP file is required.";
      return;
    }

    try {
      loading.value = true;

      const formData = new FormData();
      formData.append("comicName", formValues.value.comicName);
      formData.append("chapterName", formValues.value.chapterName);
      formData.append("date", formValues.value.date);
      formData.append("start", formValues.value.start);
      formData.append("end", formValues.value.end);
      formData.append("file", fileList.value[0].raw);

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/upload/zip`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok && data?.status) {
        Swal.fire({
          text: data.message || "ZIP file successfully uploaded!",
          icon: "success",
          confirmButtonText: "Ok, got it!",
        }).then(() => {
          router.push({ name: "apps-uploads-all" });
        });
      } else {
        throw new Error(data?.message || "Failed to upload ZIP file.");
      }
    } catch (error) {
      Swal.fire({
        text: error.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "Try again!",
      });
    } finally {
      loading.value = false;
    }
  });
};
</script>
