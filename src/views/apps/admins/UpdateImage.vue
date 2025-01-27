<template>
  <div class="min-h-screen flex items-center justify-center">
    <div v-if="!loading" class="w-full rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="mb-5 text-center">
        <h1 class="text-2xl font-bold">
          {{ $t("updatePhoto") }}
        </h1>
      </div>

      <!-- Form -->
      <el-form
        @submit.prevent="submit"
        :model="localFormData"
        :rules="rules"
        ref="formRef"
        class="space-y-6"
      >
        <!-- Photo Upload -->
        <div>
          <label class="block text-sm font-medium">
            {{ $t("uploadPhoto") }}
          </label>
          <el-form-item prop="files">
            <el-upload
              v-model:file-list="localFormData.files"
              class="upload-demo"
              :limit="1"
              :auto-upload="false"
              accept=".jpg,.png"
              list-type="picture-card"
              :on-change="handleUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
            >
              <el-button type="primary">{{ $t("uploadPhoto") }}</el-button>
              <template #tip>
                <div
                  class="el-upload__tip text-sm"
                  :class="{ 'text-red-600': errorVal }"
                >
                  {{ $t("messageError") }}
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-4">
          <button
            :disabled="loading"
            class="btn-primary bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-4 w-full rounded-md"
          >
            <span v-if="!loading">{{ $t("updatePhoto") }}</span>
            <span v-if="loading" class="flex items-center gap-2">
              {{ $t("pleaseWait") }}
              <span
                class="loader inline-block border-2 border-t-transparent border-gray-600 dark:border-gray-300 rounded-full w-4 h-4 animate-spin"
              ></span>
            </span>
          </button>
        </div>
      </el-form>

      <!-- Image Preview Dialog -->
      <el-dialog v-model="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </div>
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";

const router = useRouter();
const { locale } = useI18n();

// Local State
const formRef = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const errorVal = ref(false);
const changeImg = ref(false);
const loading = ref(false);

// Form data
const localFormData = ref({
  files: [{}],
});

// Validation Rules
const rules = ref({
  files: [
    { required: true, message: "Please upload an image", trigger: "change" },
  ],
});

// File Handlers
const handleRemove = () => {
  errorVal.value = false;
};

const handleUpload = (file) => {
  if (file.size / 1024 / 1024 > 0.5) {
    errorVal.value = true;
    return false;
  }
  errorVal.value = false;
  changeImg.value = true;
  return true;
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

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
    localFormData.value.files[0].url = response.data?.value?.data.image;
    loading.value = false;
  } catch (error) {
    loading.value = false;

    console.error("Error fetching data:", error);
  }
};

fetchData();

// Reset Form
const resetForm = () => {
  formRef.value?.resetFields();
  localFormData.value = {
    files: [],
  };
};

// Submit Form
const submit = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      const formDataToSend = new FormData();

      if (localFormData.value.files.length && changeImg.value) {
        formDataToSend.append("image_file", localFormData.value.files[0].raw);
      } else {
        Swal.fire({
          text: "Please select an image to upload.",
          icon: "error",
          confirmButtonText: "OK",
        });
        loading.value = false;
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/auth/image`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      const result = await response.json();
      loading.value = false;

      if (response.ok && result.status) {
        Swal.fire({
          text: "Photo updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
        localStorage.removeItem("authToken");
        router.push("/sign-in");
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text:"Failed to update photo. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  });
};
</script>
