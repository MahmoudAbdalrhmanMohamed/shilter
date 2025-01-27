<template>
  <div
    class="modal fade"
    id="kt_modal_add_customer"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_customer_header">
          <h2 class="fw-bold">{{ $t("addService") }}</h2>
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
                <label class="required fs-6 fw-semibold mb-2">
                  {{ $t("uploadPhoto") }}
                </label>
                <el-form-item prop="files">
                  <el-upload
                    v-model:file-list="formData.files"
                    class="upload-demo"
                    :limit="1"
                    :auto-upload="false"
                    accept=".jpg,.png"
                    list-type="picture-card"
                    :on-change="handleUpload"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :on-preview="handlePreview"
                  >
                    <el-button type="primary">{{
                      $t("uploadPhoto")
                    }}</el-button>
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
            >
              {{ $t("discard") }}
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary d-flex items-center"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">
                {{ $t("addService") }}
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
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useFetch } from "@vueuse/core";
import { hideModal } from "../../../core/helpers/modal.ts";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const emit = defineEmits(["newRow"]);

const formRef = ref(null);
const addCustomerModalRef = ref(null);
const loading = ref(false);
const errorVal = ref(false);
const formData = ref({
  nameAr: "",
  nameEn: "",
  files: [],
});

const handleRemove = (file) => {
  console.log("File removed:", file.raw);
  errorVal.value = false;
};

const handleUpload = (file) => {
  if (file.size / 1024 / 1024 > 0.5) {
    errorVal.value = true;
    return false;
  } else {
    errorVal.value = false;
  }
  return true;
};

const beforeUpload = (file) => {
  return handleUpload(file);
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const rules = ref({
  nameAr: [
    {
      required: true,
      message: t("serviceError"),
      trigger: "blur",
    },
  ],
  nameEn: [
    {
      required: true,
      message: t("serviceErrorEn"),
      trigger: "blur",
    },
  ],
  files: [
    {
      required: true,
      message: t("imageFile"),
      trigger: "change",
    },
  ],
});

const resetForm = () => {
  formData.value.nameAr = "";
  formData.value.nameEn = "";
  formData.value.files = [];
  if (formRef.value) formRef.value.resetFields();
};

const submit = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      const formDataToSend = new FormData();
      formDataToSend.append("name[ar]", formData.value.nameAr);
      formDataToSend.append("name[en]", formData.value.nameEn);

      if (formData.value.files.length > 0) {
        formDataToSend.append("image_file", formData.value.files[0].raw);
      }

      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/services`,
          {
            method: "POST",
            body: formDataToSend,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        ).json();

        loading.value = false;

        if (data?.value?.status) {
          resetForm();
          Swal.fire({
            text: t("formSubmitSuccess"),
            icon: "success",
            confirmButtonText: t("ok"),
            customClass: { confirmButton: "btn btn-primary" },
          });
          hideModal(addCustomerModalRef.value);
          emit("newRow", data.value);
        } else {
          throw new Error(t("formSubmitError"));
        }
      } catch (error) {
        loading.value = false;
        Swal.fire({
          text: t("formSubmitError"),
          icon: "error",
          confirmButtonText: t("tryAgain"),
          customClass: { confirmButton: "btn btn-danger" },
        });
      }
    }
  });
};
</script>

