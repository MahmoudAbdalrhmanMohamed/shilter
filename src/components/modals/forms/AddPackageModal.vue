<template>
  <div
    class="modal fade"
    id="kt_modal_add_package"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!-- Modal Dialog -->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header" id="kt_modal_add_customer_header">
          <h2 class="fw-bold">{{ $t("addPackage") }}</h2>
          <button
            id="kt_modal_add_customer_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            aria-label="Close Modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>

        <!-- Form -->
        <el-form
          @submit.prevent="submit"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <!-- Modal Body -->
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7" id="kt_modal_add_customer_scroll">
              <!-- Name in Arabic -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("nameInArabic")
                }}</label>
                <el-form-item prop="name.ar">
                  <el-input
                    v-model="formData.name.ar"
                    type="text"
                    :placeholder="$t('nameInArabic')"
                  />
                </el-form-item>
              </div>

              <!-- Name in English -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("nameInEnglish")
                }}</label>
                <el-form-item prop="name.en">
                  <el-input
                    v-model="formData.name.en"
                    type="text"
                    :placeholder="$t('nameInEnglish')"
                  />
                </el-form-item>
              </div>

              <!-- Description in Arabic -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("descriptionAr")
                }}</label>
                <el-form-item prop="description.ar">
                  <el-input
                    v-model="formData.description.ar"
                    type="text"
                    :placeholder="$t('descriptionAr')"
                  />
                </el-form-item>
              </div>

              <!-- Description in English -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("descriptionEn")
                }}</label>
                <el-form-item prop="description.en">
                  <el-input
                    v-model="formData.description.en"
                    type="text"
                    :placeholder="$t('descriptionEn')"
                  />
                </el-form-item>
              </div>

              <!-- Durations -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("durations")
                }}</label>
                <div
                  v-for="(duration, index) in formData.durations"
                  :key="index"
                  class="mb-4"
                >
                  <el-form-item
                    :prop="'durations.' + index + '.duration_months'"
                  >
                    <el-input
                      v-model="duration.duration_months"
                      type="number"
                      :placeholder="$t('durationMonths')"
                    />
                  </el-form-item>
                  <el-form-item :prop="'durations.' + index + '.points'">
                    <el-input
                      v-model="duration.points"
                      type="number"
                      :placeholder="$t('points')"
                    />
                  </el-form-item>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm mt-2"
                    @click="removeDuration(index)"
                  >
                    {{ $t("remove") }}
                  </button>
                </div>
                <button
                  type="button"
                  class="btn btn-light-primary btn-sm mt-2"
                  @click="addDuration"
                >
                  {{ $t("addDuration") }}
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
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
                {{ $t("addPackage") }}
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
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import { hideModal } from "../../../core/helpers/modal.ts";

const emit = defineEmits(["newRow"]);
const { locale } = useI18n();
const formRef = ref(null);
const addCustomerModalRef = ref(null);
const loading = ref(false);

// Form data model
const formData = ref({
  name: { ar: "", en: "" },
  description: { ar: "", en: "" },
  durations: [{ duration_months: "", points: "" }],
});

// Validation rules
const rules = ref({
  "name.ar": [
    { required: true, message: "Name in Arabic is required", trigger: "blur" },
  ],
  "name.en": [
    { required: true, message: "Name in English is required", trigger: "blur" },
  ],
  "description.ar": [
    {
      required: true,
      message: "Description in Arabic is required",
      trigger: "blur",
    },
  ],
  "description.en": [
    {
      required: true,
      message: "Description in English is required",
      trigger: "blur",
    },
  ],
  durations: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!value.length) {
          return callback(new Error("At least one duration is required."));
        }
        for (let i = 0; i < value.length; i++) {
          if (!value[i].duration_months) {
            return callback(
              new Error(`Duration ${i + 1}: Months is required.`),
            );
          }
          if (!value[i].points) {
            return callback(
              new Error(`Duration ${i + 1}: Points is required.`),
            );
          }
        }
        return callback();
      },
      trigger: "change",
    },
  ],
});

// Reset form
const resetForm = () => {
  formData.value = {
    name: { ar: "", en: "" },
    description: { ar: "", en: "" },
    durations: [{ duration_months: "", points: "" }],
  };
  if (formRef.value) formRef.value.resetFields();
};

// Add new duration
const addDuration = () => {
  formData.value.durations.push({ duration_months: "", points: "" });
};

// Remove duration
const removeDuration = (index) => {
  formData.value.durations.splice(index, 1);
};

const submit = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      // Prepare the payload
      const payload = {
        name: formData.value.name,
        description: formData.value.description,
        durations: formData.value.durations,
      };

      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/packages`,
          {
            method: "POST",
            body: JSON.stringify(payload), // Send JSON data
            headers: {
              "Content-Type": "application/json", // Set content type
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        ).json();

        if (data.value?.status) {
          emit("newRow", data.value.data);
          Swal.fire({
            text: "Form has been successfully submitted!",
            icon: "success",
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" },
          });
          resetForm();
          hideModal("#kt_modal_add_package");
        } else {
          Swal.fire({
            text: data.value.message || "An error occurred.",
            icon: "error",
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" },
          });
        }
      } catch (error) {
        Swal.fire({
          text: "Submission failed. Please try again later.",
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
