<template>
  <div
    class="modal fade"
    id="kt_modal_update_service"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div v-if="!loading" class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_customer_header">
          <h2 class="fw-bold">{{ $t("updateService") }}</h2>
          <button
            id="kt_modal_add_customer_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            aria-label="Close Modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>

        <el-form
          @submit.prevent="submit"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <div class="modal-body py-10 px-lg-17">
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_add_customer_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_add_customer_header"
              data-kt-scroll-wrappers="#kt_modal_add_customer_scroll"
              data-kt-scroll-offset="300px"
            >
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ $t("nameInArabic") }}
                </label>
                <el-form-item prop="nameAr">
                  <el-input
                    v-model="formData.nameAr"
                    type="text"
                    :placeholder="$t('nameInArabic')"
                  />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ $t("nameInEnglish") }}
                </label>
                <el-form-item prop="nameEn">
                  <el-input
                    v-model="formData.nameEn"
                    type="text"
                    :placeholder="$t('nameInEnglish')"
                  />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("uploadPhoto")
                }}</label>
                <el-form-item prop="files">
                  <el-upload
                    v-model:file-list="formData.files"
                    class="upload-demo"
                    :limit="1"
                    :auto-upload="false"
                    accept=".jpg,.png"
                    list-type="picture-card"
                    :on-change="handleUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                  >
                    <el-button type="primary">{{
                      $t("uploadPhoto")
                    }}</el-button>
                    <template v-if="errorVal" #tip>
                      <div class="el-upload__tip text-red-500">
                        {{ $t("messageError") }}
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button
              type="button"
              id="kt_modal_add_customer_cancel"
              class="btn btn-light me-3"
              @click="resetForm"
              aria-label="Discard Changes"
            >
              {{ $t("discard") }}
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary d-flex items-center"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                {{ $t("updateService") }}
                <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
              </span>
              <span v-if="loading" class="indicator-progress">
                {{ $t("pleaseWait") }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
    <div v-else class="w-screen h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { hideModal } from "../../../core/helpers/modal.ts";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";

// Props
const props = defineProps({
  currentService: {
    type: Object,
    required: false,
  },
});

// Emits
const emit = defineEmits(["updateData"]);

// Refs
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const errorVal = ref(false);
const { locale, t } = useI18n();
const changeImg = ref(false);
const formRef = ref(null);
const idRef = ref(null);
const addCustomerModalRef = ref(null);
const loading = ref(false);
const formData = ref({
  nameAr: "",
  nameEn: "",
  files: [],
});

// Validation Rules
const rules = ref({
  nameAr: [{ required: true, message: t("serviceError"), trigger: "blur" }],
  nameEn: [{ required: true, message: t("serviceErrorEn"), trigger: "blur" }],
  files: [{ required: true, message: t("imageFile"), trigger: "change" }],
});

// File Handlers
const handleRemove = (file) => {
  console.log("File removed:", file.raw);
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

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

// Reset Form
const resetForm = () => {
  formData.value = { nameAr: "", nameEn: "", files: [] };
  formRef.value?.resetFields();
};

// Submit Form

const submit = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;

    const formDataToSend = {
      name: {
        ar: formData.value.nameAr,
        en: formData.value.nameEn,
      },
    };

    // Include the image data only if applicable
    if (formData.value.files.length > 0 && changeImg.value) {
      formDataToSend.image_file = formData.value.files[0].raw; // Adjust based on how the API expects the file reference
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/services/${idRef.value}?_method=PUT`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            token: localStorage.getItem("authToken"),
          },
          body: JSON.stringify(formDataToSend),
        },
      );

      const data = await response.json();
      loading.value = false;

      if (response.ok && data.status) {
        resetForm();
        Swal.fire({
          text: data.message,
          icon: "success",
          confirmButtonText: t("ok"),
          customClass: { confirmButton: "btn btn-primary" },
        });
        hideModal("#kt_modal_update_service");

        emit("updateData", data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text: error.message,
        icon: "error",
        confirmButtonText: t("tryAgain"),
        customClass: { confirmButton: "btn btn-danger" },
      });
    }
  });
};

// const fetchServiceName = async (id, lang) => {
//   loading.value = true;
//   const { data } = await useFetch(
//     `${import.meta.env.VITE_APP_API_URL_MEGATRON}/services/${id}`,
//     {
//       headers: {
//         "X-localization": lang,
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//     },
//   ).json();
//   loading.value = false;

//   return data.value.data.name;
// };

watch(
  () => props.currentService,
  async (newService) => {
    idRef.value = newService.id || null;
    const [nameAr, nameEn] = [newService.name.ar, newService.name.en];
    formData.value = {
      nameAr,
      nameEn,
      files: newService.image
        ? [{ url: newService.image, name: "uploaded", raw: null }]
        : [],
    };
  },
);
</script>
