<template>
  <div
    class="modal fade"
    id="kt_modal_update_socials"
    ref="updateUserModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_update_user_header">
          <h2 class="fw-bold">{{ $t("updateSocials") }}</h2>
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
          :model="formData"
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
              <!-- Form Fields -->
              <div v-for="field in fields" :key="field.key" class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">
                  {{ field.label }}
                </label>
                <el-form-item :prop="field.key">
                  <el-input
                    v-model="formData[field.key]"
                    :placeholder="field.label"
                    type="text"
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
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary d-flex items-center"
              type="submit"
            >
              <span v-if="!loading">{{ $t("updateUser") }}</span>
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
import { hideModal } from "../../../core/helpers/modal.ts";

// Props
const props = defineProps({
  currentUser: {
    type: Object,
    required: false, // Optional to allow null/undefined
    default: () => null,
  },
});

// Emits
const emit = defineEmits(["updateData"]);

// Refs
const formRef = ref(null);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const changeImg = ref(false);
const loading = ref(false);

// Form Data and Validation Rules
const formData = ref({
  whatsapp: "",
  telegram: "",
  facebook: "",
  instagram: "",
  phone: "",
  x: "",
});
const rules = ref({
  whatsapp: [
    { required: true, message: "WhatsApp is required", trigger: "blur" },
  ],
  telegram: [
    { required: true, message: "Telegram is required", trigger: "blur" },
  ],
  facebook: [
    { required: true, message: "Facebook is required", trigger: "blur" },
  ],
  instagram: [
    { required: true, message: "Instagram is required", trigger: "blur" },
  ],
  phone: [{ required: true, message: "Phone is required", trigger: "blur" }],
  x: [{ required: true, message: "X is required", trigger: "blur" }],
});

// Field Labels
const fields = [
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "phone", label: "phone" },
  { key: "phone", label: "phone" },
  { key: "x", label: "X" },
];

// Watch for Current User Changes
watch(
  () => props.currentUser,
  (newUser) => {
    if (newUser) {
      formData.value = {
        whatsapp: newUser.whatsapp || "",
        telegram: newUser.telegram || "",
        facebook: newUser.facebook || "",
        instagram: newUser.instagram || "",
        phone: newUser.phone || "",
        x: newUser.x || "",
      };
    } else {
      resetForm();
    }
  },
);

// Reset Form
const resetForm = () => {
  formRef.value?.resetFields();
  formData.value = {
    whatsapp: "",
    telegram: "",
    facebook: "",
    instagram: "",
    phone: "",
    x: "",
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
      formDataToSend.append("whatsapp", formData.value.whatsapp);
      formDataToSend.append("telegram", formData.value.telegram);
      formDataToSend.append("facebook", formData.value.facebook);
      formDataToSend.append("instagram", formData.value.instagram);
      formDataToSend.append("phone", formData.value.phone);
      formDataToSend.append("x", formData.value.x);

      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users/${props.currentUser?.id}?_method=PUT`,
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
          text: "Workshop Socials updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        emit("updateData", data.value.data);
        resetForm();
        hideModal("kt_modal_update_socials");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      loading.value = false;
      Swal.fire({
        text: "Failed to update user. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  });
};
</script>
