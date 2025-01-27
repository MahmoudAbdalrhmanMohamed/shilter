<template>
  <div v-if="!loading">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="onSubmit"
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
          <span v-if="!loading">{{ $t("addCategorie") }}</span>
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
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";
import { useRouter } from "vue-router";

const formRef = ref(null);
const dialogImageUrl = ref(null);
const dialogVisible = ref(null);
const loading = ref(false);

const router = useRouter();

const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
  // { lang: "chinese", code: "zh" },
  // { lang: "indian", code: "hi" },
  // { lang: "italian", code: "it" },
  // { lang: "spanish", code: "es" },
  // { lang: "russian", code: "ru" },
  // { lang: "turkish", code: "tr" },
  // { lang: "french", code: "fr" },
  // { lang: "german", code: "de" },
];

const formData = ref({
  names: {},
  descriptions: {},
  logoFiles: [],
  year: "",
  rate: null,
  country: "",
});

const rules = ref({
  names: Object.fromEntries(
    languages.map(({ code }) => [
      code,
      {
        required: true,
        message: `${code} Name is required`,
        min: 4,
        trigger: "blur",
      },
    ]),
  ),
});

const resetForm = () => {
  formRef.value?.resetFields();
  formData.value = {
    names: {},
    descriptions: {},
    logoFiles: [],
    year: null,
    rate: null,
    country: "",
  };
};

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    try {
      // Create a new FormData object
      const payload = new FormData();

      // Add names and descriptions
      languages.forEach((lang) => {
        payload.append(`name[${lang.code}]`, formData.value.names[lang.code]);
      });

      console.log("Payload to send:", payload);

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/categories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: payload,
        },
      );

      const data = await response.json();
      loading.value = false;

      if (response.ok && data?.status) {
        Swal.fire({
          text: "Categories added successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
        router.push({ name: "apps-categories-all" });
      } else {
        throw new Error(data.message || "Failed to add categorie.");
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text: error.message || "Something went wrong!",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  });
};

const handleLogoChange = (file) => {
  console.log("File uploaded:", file.name);
  return true;
};

const handleRemove = (file) => {
  console.log("File removed:", file.name);
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};
</script>
