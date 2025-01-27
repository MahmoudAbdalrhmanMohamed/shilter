<template>
  <div
    class="modal fade"
    id="kt_modal_update_brand_name"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div v-if="!loading" class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("updateBrand") }}</h2>
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
                $t("updateBrand")
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
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
const idRef = ref();
import { hideModal } from "@/core/helpers/modal";

const { t } = useI18n();

const emit = defineEmits(["updateData"]);
const props = defineProps({
  currentBrand: {
    type: Object,
    default: () => ({}),
  },
});

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
  formRef.value?.resetFields();
};

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      // Emit update event with current form data

      // Prepare JSON payload
      const payload = {
        name: {
          ar: formData.value.nameAr,
          en: formData.value.nameEn,
        },
      };

      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands/${idRef.value}`,
          {
            method: "PUT", // Direct PUT request
            body: JSON.stringify(payload), // Convert payload to JSON
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        ).json();
        emit("updateData", data.value.data);
        Swal.fire({
          text: "Form Submitted",
          icon: "success",
          confirmButtonText: "Ok Got It",
          customClass: { confirmButton: "btn btn-primary" },
        });

        resetForm();
      } catch (error) {
        Swal.fire({
          text: "Error submitting the form",
          icon: "error",
          confirmButtonText: "Retry",
          customClass: { confirmButton: "btn btn-danger" },
        });
      } finally {
        hideModal("#kt_modal_update_brand_name");
        loading.value = false;
      }
    }
  });
};

const fetchServiceName = async (id) => {
  loading.value = true;
  const { data } = await useFetch(
    `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands/${id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    },
  ).json();
  loading.value = false;
  return data.value.data.name;
};

// Watch for changes to currentBrand
watch(
  () => props.currentBrand,
  async (newBrand) => {
    idRef.value = newBrand.id || null;
    const nameAr = newBrand.name.ar;
    const nameEn = newBrand.name.en;
    formData.value = {
      nameAr,
      nameEn,
    };
  },
);
</script>
<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 2px solid #fff;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  left: 0;
  top: 0;
  background: #ff3d00;
  width: 6px;
  height: 6px;
  transform: translate(150%, 150%);
  border-radius: 50%;
}
.loader::before {
  left: auto;
  top: auto;
  right: 0;
  bottom: 0;
  transform: translate(-150%, -150%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
