<template>
  <div
    class="modal fade"
    id="kt_modal_update_workshop_socials"
    tabindex="-1"
    aria-hidden="true"
    ref="modalRef"
  >
    <div v-if="!loading" class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("updateSocials") }}</h2>
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
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2 capitalize">
                  {{ formData.platform }}
                </label>
                <el-form-item prop="url">
                  <el-input
                    v-model="formData.url"
                    type="text"
                    placeholder="url"
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
                $t("updateSocials")
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
import { useFetch } from "@vueuse/core/index.cjs";
import { useI18n } from "vue-i18n";


const loading = ref(false);
const formRef = ref(null);
const modalRef = ref(null);
const formData = ref({
  platform: "",
  url: "",
});

loading.value = true;

const rules = ref({
  url: [
    { required: true, message: "service name is required", trigger: "blur" },
  ],
});

const emit = defineEmits(["updateData"]);
const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({}),
  },
});

const { locale } = useI18n();

watch(
  () => props.currentUser,
  (newVal) => {
    if (newVal && newVal.id) {
      formData.value.platform = newVal.platform;
      formData.value.url = newVal.url;
    }
  },
);

let modal = ref(null);

// Initialize the modal programmatically
onMounted(() => {
  if (modalRef.value) {
    modal.value = new Modal(modalRef.value); // Bootstrap modal initialization
  }
});

/**
 * Reset form fields
 */
const resetForm = () => {
  formData.value = {
    platform: "",
    url: "",
  };
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

/**
 * Submit form
 */
const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("platform", formData.value.platform);
        formDataToSend.append("url", formData.value.url);

        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshop/socials/${props.currentUser.id}?_method=PUT`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: formDataToSend,
          },
        ).json();

        if (data.value.status) {
          emit("updateData", formData.value);
          Swal.fire({
            text: "Form has been successfully submitted!",
            icon: "success",
            confirmButtonText: "Ok, got it!",
            customClass: { confirmButton: "btn btn-primary" },
          });
          resetForm();
          if (modal.value) {
            modal.value.hide();
          }
        } else {
          Swal.fire({
            text: "Failed to update the model!",
            icon: "error",
            confirmButtonText: "Try Again",
            customClass: { confirmButton: "btn btn-danger" },
          });
        }
      } catch (error) {
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

loading.value = false;
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
