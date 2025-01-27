<template>
  <div
    class="modal fade"
    id="kt_modal_reset_user_password"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Reset User Password</h2>
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
                <label class="required fs-6 fw-semibold mb-2"
                  >Old Password</label
                >
                <el-form-item prop="oldPassword">
                  <el-input
                    v-model="formData.oldPassword"
                    type="text"
                    placeholder="oldPassword"
                  />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2"
                  >New Password</label
                >
                <el-form-item prop="password">
                  <el-input
                    v-model="formData.password"
                    type="text"
                    placeholder="new Password"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2"
                  >Confirm Password</label
                >
                <el-form-item prop="conPassword">
                  <el-input
                    v-model="formData.conPassword"
                    type="text"
                    placeholder="Confirm Password"
                  />
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="modal-footer flex-center">
            <button type="button" class="btn btn-light me-3" @click="resetForm">
              Discard
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading" class="indicator-label"
                >Reset User password</span
              >
              <span v-else class="indicator-progress">
                Please wait...
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
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";

const emit = defineEmits(["data"]);

const loading = ref(false);
const formRef = ref(null);
const formData = ref({
  oldPassword: "",
  password: "",
  conPassword: "",
});

const props = defineProps(["userId"]);

// Validation rules
const rules = {
  oldPassword: [
    {
      required: true,
      message: "old Password is required",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "new Password is required",
      trigger: "blur",
    },
  ],
  conPassword: [
    {
      required: true,
      message: "Confirmation password is required",
      trigger: "blur",
    },
    {
      validator: (rule, value) =>
        value === formData.value.password || "Passwords do not match",
      trigger: "blur",
    },
  ],
};

const resetForm = () => {
  formData.value = {
    oldPassword: "",
    password: "",
    conPassword: "",
  };
  formRef.value.resetFields();
};

watch(
  () => props.userId,
  (newUserId) => {
    if (newUserId) {
      formData.value.oldPassword = newUserId;
    }
  },
);

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const formDataToSend = new formData();
      formDataToSend.append("name[en]", formData.value.nameEn);
      formDataToSend.append("name[ar]", formData.value.nameAr);
      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      emit("data", data.value.data);
      loading.value = false;
      Swal.fire("Form submitted successfully!", "", "success");
      resetForm();
    }
  });
};
</script>
