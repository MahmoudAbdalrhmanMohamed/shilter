<template>
  <div v-if="!loading">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="onSubmitUpdate"
    >
      <div class="modal-body py-10 px-lg-17">
        <div v-for="lang in languages" :key="lang.code" class="mb-10">
          <h2 class="text-2xl capitalize font-bold text-gray-800">
            {{ $t(lang.lang) }}
          </h2>
          <hr class="w-full mb-4 bg-gray-800" />

          <!-- Name -->
          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("name")
            }}</label>
            <el-form-item :prop="`names.${lang.code}`">
              <el-input
                class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
                v-model="formData.names[lang.code]"
                autocomplete="off"
              />
            </el-form-item>
          </div>

          <!-- Description -->
          <div class="fv-row mb-5">
            <label class="form-label fs-6 fw-bold text-gray-900">{{
              $t("description")
            }}</label>
            <el-form-item :prop="`descriptions.${lang.code}`">
              <el-input
                class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
                v-model="formData.descriptions[lang.code]"
                type="textarea"
                :rows="4"
              />
              <small class="text-gray-500">
                {{ formData.descriptions[lang.code]?.length || 0 }}/50
                characters
              </small>
            </el-form-item>
          </div>
        </div>

        <!-- Logo Upload -->
        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("logo")
          }}</label>
          <el-form-item prop="logoFiles">
            <el-upload
              v-model:file-list="formData.logoFiles"
              class="upload-demo"
              :limit="1"
              :auto-upload="false"
              accept=".jpg,.png"
              list-type="picture-card"
              :on-change="handleLogoChange"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
            >
              <el-button type="primary">{{ $t("uploadLogo") }}</el-button>
            </el-upload>
          </el-form-item>
        </div>

        <!-- Year -->
        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("year")
          }}</label>
          <el-form-item prop="year">
            <el-input
              class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
              v-model="formData.year"
              type="number"
              autocomplete="off"
            />
          </el-form-item>
        </div>

        <!-- Rate -->
        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("rate")
          }}</label>
          <el-form-item prop="rate">
            <el-input
              class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
              v-model="formData.rate"
              type="number"
              min="1"
              max="5"
              step="0.1"
              placeholder="3.3"
            />
          </el-form-item>
        </div>

        <!-- Country -->
        <div class="fv-row mb-10">
          <label class="form-label fs-6 fw-bold text-gray-900">{{
            $t("country")
          }}</label>
          <el-form-item prop="country">
            <el-input
              class="bg-[var(--bs-gray-100)] border-[var(--bs-gray-100)] rounded-lg"
              v-model="formData.country"
              autocomplete="off"
            />
          </el-form-item>
        </div>
      </div>

      <div class="modal-footer flex-center">
        <button
          type="button"
          class="btn btn-light me-3"
          @click="resetForm"
          aria-label="Discard Changes"
        >
          {{ $t("discard") }}
        </button>
        <button
          class="btn btn-lg btn-primary d-flex items-center"
          :data-kt-indicator="loading ? 'on' : null"
          type="submit"
        >
          <span v-if="!loading">{{ $t("updatePublisher") }}</span>
          <span v-if="loading" class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </el-form>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>

  <div v-else class="w-screen h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";

const formRef = ref(null);
const dialogImageUrl = ref(null);
const dialogVisible = ref(false);
const loading = ref(false);
const img = ref(false);

const router = useRouter();
const route = useRoute();

const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
  { lang: "chinese", code: "zh" },
  { lang: "indian", code: "hi" },
  { lang: "italian", code: "it" },
  { lang: "spanish", code: "es" },
  { lang: "russian", code: "ru" },
  { lang: "turkish", code: "tr" },
  { lang: "french", code: "fr" },
  { lang: "german", code: "de" },
];

const formData = ref({
  names: Object.fromEntries(languages.map((lang) => [lang.code, ""])),
  descriptions: Object.fromEntries(languages.map((lang) => [lang.code, ""])),
  logoFiles: [],
  year: "",
  rate: null,
  country: "",
});

const rules = ref({
  year: [{ required: true, message: "Year is required", trigger: "blur" }],
  rate: [{ required: true, message: "Rate is required", trigger: "blur" }],
  country: [
    { required: true, message: "Country is required", trigger: "blur" },
  ],
  logoFiles: [
    { required: true, message: "Logo is required", trigger: "change" },
  ],
  names: Object.fromEntries(
    languages.map(({ code }) => [
      code,
      { required: true, message: `${code} Name is required`, trigger: "blur" },
    ]),
  ),
  descriptions: Object.fromEntries(
    languages.map(({ code }) => [
      code,
      {
        required: true,
        min: 50,
        message: `${code} Description must be at least 50 characters`,
        trigger: "blur",
      },
    ]),
  ),
});

const fetchPublisherData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/publishers/${route.params.updatePublisher}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();

    if (response.ok) {
      const publisherData = data.data;
      formData.value.names = { ...formData.value.names, ...publisherData.name };
      formData.value.descriptions = {
        ...formData.value.descriptions,
        ...publisherData.description,
      };
      formData.value.country = publisherData.country || "";
      formData.value.rate = publisherData.rate || "";
      formData.value.year = publisherData.year || "";
      formData.value.logoFiles = publisherData.image
        ? [{ name: "Existing Logo", url: publisherData.image, raw: null }]
        : [];
      loading.value = false;
    } else {
      throw new Error("Failed to fetch publisher data.");
    }
  } catch (error) {
    Swal.fire("Error", error.message, "error");
    loading.value = false;
  }
};

const resetForm = () => fetchPublisherData();

const onSubmitUpdate = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      // Construct the payload as a JSON object
      const payload = {
        year: formData.value.year,
        rate: formData.value.rate,
        country: formData.value.country,
        name: formData.value.names,
        description: formData.value.descriptions,
        // Handle the logo: Use a file URL, base64 string, or other format if supported by the backend
        image_file:
          formData.value.logoFiles.length && img.value
            ? formData.value.logoFiles[0].raw
            : null,
      };

      // Send the request with application/json content-type
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/publishers/${route.params.updatePublisher}`,
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
      loading.value = false;

      if (response.ok) {
        Swal.fire("Success", "Publisher updated successfully.", "success");
        router.replace({ name: "apps-publishers-all" });
      } else {
        throw new Error(data.message || "Failed to update publisher.");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
      loading.value = false;
    }
  });
};

fetchPublisherData();

const handleLogoChange = (file) => {
  img.value = true; // Mark image as updated
  return true;
};

const handleRemove = (file) => {
  img.value = false; // Reset if no file
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};
</script>
