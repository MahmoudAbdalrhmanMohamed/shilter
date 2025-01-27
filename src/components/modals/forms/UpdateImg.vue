<template>
  <div
    class="modal fade"
    id="kt_modal_update_img"
    ref="updateUserModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_update_user_header">
          <h2 class="fw-bold">{{ $t("updatePhoto") }}</h2>
          <button
            id="kt_modal_update_user_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            aria-label="Close Modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>

        <el-form
          @submit.prevent="submit"
          :model="localFormData"
          :rules="rules"
          ref="formRef"
        >
          <div class="modal-body py-10 px-lg-17">
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_update_user_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_update_user_header"
              data-kt-scroll-wrappers="#kt_modal_update_user_scroll"
              data-kt-scroll-offset="300px"
            >
              <!-- Photo Upload -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("uploadPhoto")
                }}</label>
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
                    <el-button type="primary">{{
                      $t("uploadPhoto")
                    }}</el-button>
                    <template #tip>
                      <div
                        class="el-upload__tip"
                        :class="{ 'text-danger': errorVal }"
                      >
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
              <span v-if="!loading">{{ $t("updatePhoto") }}</span>
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

  <!-- Image Preview Dialog -->
  <el-dialog v-model="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";
import { hideModal } from "@/core/helpers/modal";

// Props and Emits
const props = defineProps({
  value: {
    required: true,
  },
  workshop_id: {
    default: "",
  },
});

const emit = defineEmits(["submitted"]);

// Local State
const formRef = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const errorVal = ref(false);
const changeImg = ref(false);
const loading = ref(false);
const id = ref(null);

// Form data
const localFormData = ref({
  files: [{ url: "", name: "" }],
});

// Watch Prop
watch(
  () => props.value,
  (newVal) => {
    localFormData.value.files[0].url = newVal.image || "";
  },
);
watch(
  () => props.workshop_id,
  (newVal) => {
    id.value = newVal || "";
  },
);

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
        formDataToSend.append("photo", localFormData.value.files[0].raw);
        formDataToSend.append("workshop_id", id.value);
      } else {
        Swal.fire({
          text: "Please select an image to upload.",
          icon: "error",
          confirmButtonText: "OK",
        });
        loading.value = false;
        return;
      }

      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/images/${id.value}`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      ).json();

      loading.value = false;

      if (data.value?.status) {
        Swal.fire({
          text: "Photo updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        resetForm();
        hideModal("#kt_modal_update_img");
        emit("submitted", data.value);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text: "Failed to update photo. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  });
};
</script>
