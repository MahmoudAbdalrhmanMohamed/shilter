<template>
  <div
    class="modal fade"
    id="kt_modal_add_duration"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("addDuration") }}</h2>
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
            <div class="scroll-y me-n7 pe-7" id="kt_modal_add_customer_scroll">
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
                $t("addDuration")
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";
import { useFetch } from "@vueuse/core";

import { hideModal } from "../../../core/helpers/modal.ts";

const emit = defineEmits(["data"]);

const loading = ref(false);
const formRef = ref(null);
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

const resetForm = () => {
  formData.value = {
    duration_months: null,
    points: null,
  };
  formRef.value.resetFields();
};

const route = useRoute();

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const payload = {
        duration_months: formData.value.duration_months,
        points: formData.value.points,
      };
      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/packages/${route.params.package}/durations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(payload),
          },
        ).json();

        emit("data", data.value.data);
        Swal.fire({
          text: "Form has been successfully submitted!",
          icon: "success",
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        });
        resetForm();
        hideModal("#kt_modal_add_duration");
      } catch (error) {
        Swal.fire({
          text: "An error occurred.",
          icon: "error",
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        });
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>
