<template>
  <div
    class="modal fade"
    id="kt_modal_update_duration"
    tabindex="-1"
    aria-hidden="true"
    ref="modalRef"
  >
    <div v-if="!loading" class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("updateDuration") }}</h2>
          <button
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
            <div class="scroll-y me-n7 pe-7">
              <!-- Duration Months -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("durationMonths")
                }}</label>
                <el-form-item prop="duration_months">
                  <el-input
                    v-model.number="formData.duration_months"
                    type="number"
                    :placeholder="$t('durationMonths')"
                  />
                </el-form-item>
              </div>

              <!-- Points -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("points")
                }}</label>
                <el-form-item prop="points">
                  <el-input
                    v-model.number="formData.points"
                    type="number"
                    :placeholder="$t('points')"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="modal-footer flex-center">
            <button type="button" class="btn btn-light me-3" @click="resetForm">
              {{ $t("discard") }}
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label">{{
                $t("updateDuration")
              }}</span>
              <span v-else class="indicator-progress">
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
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import { useFetch } from "@vueuse/core";
import { hideModal } from "../../../core/helpers/modal.ts";

const emit = defineEmits(["data"]);
const props = defineProps({
  initialData: {
    required: true,
  },
});

const loading = ref(false);
const formRef = ref(null);
const modalRef = ref(null);
const modal = ref(null);

const formData = ref({
  duration_months: null,
  points: null,
});

// Validation rules
const rules = {
  duration_months: [
    {
      required: true,
      message: "Duration in months is required",
      trigger: "change",
    },
  ],
  points: [
    {
      required: true,
      message: "Points are required",
      trigger: "change",
    },
  ],
};

// Watch for changes in initial data and populate the form
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        duration_months: newVal.duration_months || 0,
        points: newVal.points || 0,
      };
    }
  },
);

// Initialize the modal programmatically
onMounted(() => {
  if (modalRef.value) {
    modal.value = new Modal(modalRef.value); // Bootstrap modal initialization
  }
});

// Reset form fields
const resetForm = () => {
  formData.value = {
    duration_months: props.initialData?.duration_months || 0,
    points: props.initialData?.points || 0,
  };
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// Submit form
const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      const payload = {
        duration_months: formData.value.duration_months,
        points: formData.value.points,
      };

      try {
        // Make the API request using fetch
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/durations/${props.initialData?.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(payload),
          },
        );

        // Parse the JSON response
        const data = await response.json();

        // Check for success
        if (response.ok && data?.status) {
          emit("data", formData.value); // Emit updated data
          Swal.fire({
            text: "Duration has been successfully updated!",
            icon: "success",
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" },
          });
          hideModal("#kt_modal_update_duration");
        } else {
          // Handle API errors
          Swal.fire({
            text: data?.message || "Failed to update the duration!",
            icon: "error",
            confirmButtonText: "Try Again",
            customClass: { confirmButton: "btn btn-danger" },
          });
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error submitting the form:", error);
        Swal.fire({
          text: "Something went wrong!",
          icon: "error",
          confirmButtonText: "Ok",
          customClass: { confirmButton: "btn btn-danger" },
        });
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>
