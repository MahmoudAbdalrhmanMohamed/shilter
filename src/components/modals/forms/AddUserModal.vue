<template>
  <div
    class="modal fade"
    id="kt_modal_add_user"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header" id="kt_modal_add_customer_header">
          <h2 class="fw-bold">Add User</h2>
          <button
            id="kt_modal_add_customer_close"
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
              <!-- Dynamic Form Fields -->
              <div
                v-for="field in tableHeader"
                :key="field.columnName"
                class="fv-row mb-7"
              >
                <label
                  :class="
                    field.columnName === 'firstName' ||
                    field.columnName === 'lastName'
                      ? 'required'
                      : ''
                  "
                  class="fs-6 fw-semibold mb-2"
                >
                  {{ $t(field.columnLabel) }}
                </label>
                <el-form-item :prop="field.columnName">
                  <el-input
                    v-if="
                      field.columnName !== 'verified' &&
                      field.columnName !== 'photo'
                    "
                    v-model="formData[field.columnName]"
                    :type="getInputType(field.columnName)"
                    :placeholder="$t(field.columnLabel)"
                  />
                  <el-switch
                    v-else-if="field.columnName === 'verified'"
                    v-model="formData[field.columnName]"
                  />
                  <el-upload
                    v-else-if="field.columnName === 'photo'"
                    v-model:file-list="formData.files"
                    class="upload-demo"
                    :limit="1"
                    :auto-upload="false"
                    list-type="picture-card"
                    accept=".jpg,.png"
                    :on-change="handleUpload"
                    :on-remove="handleRemove"
                    :before-upload="beforeUpload"
                    :on-preview="handlePreview"
                  >
                    <el-button type="primary">{{
                      $t("uploadPhoto")
                    }}</el-button>
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
              class="btn btn-lg btn-primary"
              type="submit"
            >
              <span v-if="!loading">{{ $t("addUser") }}</span>
              <span v-if="loading">
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
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useFetch } from "@vueuse/core";

const emit = defineEmits(["newRow"]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const formRef = ref(null);
const addCustomerModalRef = ref(null);
const loading = ref(false);

const tableHeader = [
  { columnName: "firstName", columnLabel: "firstName" },
  { columnName: "lastName", columnLabel: "lastName" },
  { columnName: "phone", columnLabel: "phone" },
  { columnName: "photo", columnLabel: "photo" },
  { columnName: "type", columnLabel: "type" },
  { columnName: "verified", columnLabel: "verified" },
];

const formData = ref({
  firstName: "",
  lastName: "",
  phone: "",
  photo: "",
  type: "",
  verified: false,
  files: [],
});

const rules = {
  firstName: [
    { required: true, message: "First name is required", trigger: "blur" },
  ],
  lastName: [
    { required: true, message: "Last name is required", trigger: "blur" },
  ],
  phone: [
    {
      required: true,
      message: "Phone number is required",
      trigger: "blur",
    },
  ],
  type: [{ required: true, message: "Type is required", trigger: "blur" }],
  photo: [{ required: true, message: "Photo is required", trigger: "change" }],
};

const handleRemove = (file) => {
  console.log("File removed:", file.raw);
  errorVal.value = false;
};

const handleUpload = (file) => {
  if (file.size / 1024 / 1024 > 0.5) {
    errorVal.value = true;
    return false;
  } else {
    errorVal.value = false;
  }
  return true;
};

const beforeUpload = (file) => {
  return handleUpload(file);
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const resetForm = () => {
  formData.value = {
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
    type: "",
    verified: false,
    files: [],
  };
  if (formRef.value) formRef.value.resetFields();
};

const submit = async () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      emit("newRow", formData.value);
      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/users`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      ).json();

      loading.value = false;
      Swal.fire({
        text: "Form has been successfully submitted!",
        icon: "success",
        confirmButtonText: "Ok, got it!",
        customClass: { confirmButton: "btn btn-primary" },
      });
      resetForm();
    }
  });
};

const getInputType = (columnName) => {
  switch (columnName) {
    case "phone":
      return "tel";
    case "verified":
    case "photo":
      return null; // These are handled by switch/upload
    default:
      return "text";
  }
};
</script>
