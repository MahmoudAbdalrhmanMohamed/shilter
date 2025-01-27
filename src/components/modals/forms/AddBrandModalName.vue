<template>
  <div
    class="modal fade"
    id="kt_modal_add_brand_name"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("addBrand") }}</h2>
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
              <!-- Basic Brand Information -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("Model Name In Arabic")
                }}</label>
                <el-form-item prop="nameAr">
                  <el-input
                    v-model="formData.nameAr"
                    type="text"
                    :placeholder="$t('Model Name In Arabic')"
                  />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("Model Name In English")
                }}</label>
                <el-form-item prop="nameEn">
                  <el-input
                    v-model="formData.nameEn"
                    type="text"
                    :placeholder="$t('Model Name In English')"
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
                $t("addBrand")
              }}</span>
              <span v-else class="indicator-progress">
                {{ "pleaseWait" }}
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
import { useFetch } from "@vueuse/core";
import { hideModal } from "@/core/helpers/modal";

const emit = defineEmits(["data"]);

const loading = ref(false);
const formRef = ref(null);
const formData = ref({
  nameAr: "",
  nameEn: "",
});

// Validation rules
const rules = {
  nameAr: [
    {
      required: true,
      message: "Brand name in Arabic is required",
      trigger: "change",
    },
  ],
  nameEn: [
    {
      required: true,
      message: "Brand name in English is required",
      trigger: "change",
    },
  ],
};

const resetForm = () => {
  formData.value = {
    nameAr: "",
    nameEn: "",
  };
  formRef.value.resetFields();
};

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      // Prepare JSON payload
      const payload = {
        name: {
          ar: formData.value.nameAr,
          en: formData.value.nameEn,
        },
      };

      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands`,
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        ).json();
        emit("data", data.value.data);
        Swal.fire("Form submitted successfully!", "", "success");
        resetForm();
      } catch (error) {
        Swal.fire("Error submitting the form!", error.message, "error");
      } finally {
        hideModal("#kt_modal_add_brand_name");
        loading.value = false;
      }
    }
  });
};
</script>
