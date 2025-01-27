<template>
  <div
    class="modal fade"
    id="kt_modal_update_services_workshop"
    ref="updateUserModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_update_user_header">
          <h2 class="fw-bold">{{ $t("updateServices") }}</h2>
          <button
            id="kt_modal_update_user_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            aria-label="Close Modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>

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
            <!-- Services Management -->
            <h4 class="fw-semibold mb-5">{{ $t("services") }}</h4>

            <div
              v-for="(service, index) in formData.services"
              :key="index"
              class="d-flex align-items-center mb-3"
            >
              <el-input
                v-model="formData.services[index]"
                placeholder="Enter a service"
                class="me-3"
                type="text"
              />
              <button
                type="button"
                class="btn btn-icon btn-danger"
                @click="removeService(index)"
                aria-label="Remove Service"
              >
                <KTIcon icon-name="trash" icon-class="fs-4" />
              </button>
            </div>

            <button
              type="button"
              class="btn btn-light-primary d-flex align-items-center"
              @click="addService"
            >
              <KTIcon icon-name="plus" icon-class="fs-4 me-2" />
              {{ $t("addService") }}
            </button>
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
            type="button"
            @click="submit"
          >
            <span v-if="!loading">{{ $t("updateServices") }}</span>
            <span v-if="loading" class="indicator-progress">
              {{ $t("pleaseWait") }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
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
const loading = ref(false);

// Form Data: Dynamically Handle Services
const formData = ref({
  services: [], // Array to hold service strings
});

// Watch for Current User Changes
watch(
  () => props.currentUser,
  (newUser) => {
    if (newUser) {
      formData.value.services = [...(newUser.services || [])];
    } else {
      resetForm();
    }
  },
);

// Reset Form
const resetForm = () => {
  formRef.value?.resetFields?.();
  formData.value.services = [];
};

// Add a Service
const addService = () => {
  formData.value.services.push(""); // Add a new empty service
};

// Remove a Service
const removeService = (index) => {
  formData.value.services.splice(index, 1); // Remove the selected service
};

// Submit Form
const submit = async () => {
  if (loading.value) return;

  // Validate the services array (optional)
  const valid = formData.value.services.every(
    (service) => service.trim() !== "",
  );
  if (!valid) {
    Swal.fire({
      text: "All service fields must be filled!",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  loading.value = true;

  try {
    const payload = {
      services: formData.value.services,
    };

    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users/${props.currentUser?.id}?_method=PUT`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      },
    ).json();

    loading.value = false;

    if (data.value?.status) {
      Swal.fire({
        text: "Services updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      emit("updateData", data.value.data);
      resetForm();
      hideModal("kt_modal_update_services_workshop");
    } else {
      throw new Error("Update failed");
    }
  } catch (error) {
    loading.value = false;
    Swal.fire({
      text: "Failed to update services. Please try again.",
      icon: "error",
      confirmButtonText: "Retry",
    });
  }
};
</script>
