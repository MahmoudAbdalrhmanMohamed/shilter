<template>
  <div
    class="modal fade"
    id="kt_modal_update_workshop"
    ref="updateWorkshopModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("updateWorkshop") }}</h2>
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
              <!-- Name -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("name")
                }}</label>
                <el-form-item prop="name">
                  <el-input
                    v-model="formData.name"
                    :placeholder="$t('workshopName')"
                  />
                </el-form-item>
              </div>

              <!-- Address -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("address")
                }}</label>
                <el-form-item prop="address">
                  <el-input
                    v-model="formData.address"
                    :placeholder="$t('workshopAddress')"
                  />
                </el-form-item>
              </div>

              <!-- Phone -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("phone")
                }}</label>
                <el-form-item prop="phone">
                  <el-input
                    v-model="formData.phone"
                    :placeholder="$t('phoneNumber')"
                  />
                </el-form-item>
              </div>

              <!-- Description -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("description")
                }}</label>
                <el-form-item prop="description">
                  <el-input
                    type="textarea"
                    :rows="7"
                    v-model="formData.description"
                    :placeholder="$t('workshopDescription')"
                  />
                </el-form-item>
              </div>

              <!-- Image -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("updateImage")
                }}</label>
                <el-form-item prop="image">
                  <el-upload
                    v-model:file-list="formData.image"
                    :limit="1"
                    :auto-upload="false"
                    list-type="picture-card"
                    :on-change="handleUpload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                  >
                    <el-button type="primary">{{
                      $t("selectImage")
                    }}</el-button>
                    <template v-if="errorVal" #tip>
                      <div class="el-upload__tip text-red-500">
                        {{ $t("messageError") }}
                      </div>
                    </template>
                  </el-upload>
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
                $t("updateWorkshop")
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

  <!-- Image Preview Dialog -->
  <el-dialog v-model="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { hideModal } from "../../../core/helpers/modal.ts";
import { useFetch } from "@vueuse/core";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const errorVal = ref(false);
const changeImg = ref(false);

const emit = defineEmits(["updateData"]);

const props = defineProps({
  currentWorkshop: {
    type: Object,
    default: () => ({}),
  },
});

const loading = ref(false);
const formRef = ref(null);
const formData = ref({
  name: "",
  address: "",
  phone: "",
  description: "",
  id: "",
  image: [],
});

const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  address: [
    { required: true, message: "Address is required", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Phone number is required", trigger: "blur" },
  ],
  description: [
    { required: true, message: "Description is required", trigger: "blur" },
  ],
  image: [{ required: true, message: "Image is required", trigger: "change" }],
};

const resetForm = () => {
  formData.value = {
    name: "",
    address: "",
    phone: "",
    description: "",
    image: [],
  };
  formRef.value.resetFields();
};

const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      const formDataToSend = {
        name: formData.value.name,
        address: formData.value.address,
        description: formData.value.description,
        phone: formData.value.phone,
      };
      if (changeImg.value && formData.value.image.length) {
        formDataToSend.append("image", formData.value.image[0].raw);
      }

      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshops/${formData.value.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(formDataToSend),
          },
        ).json();

        if (data.value.status) {
          Swal.fire("Workshop updated successfully!", "", "success");
          emit("updateData", {
            name: formData.value.name,
            address: formData.value.address,
            description: formData.value.description,
            url: formData.value.image[0].url,
          });
          resetForm();
          hideModal("#kt_modal_update_workshop");
        } else {
          Swal.fire(
            "Error",
            data.value.message || "An error occurred while updating.",
            "error",
          );
        }
      } catch (err) {
        Swal.fire("Error", "An unexpected error occurred.", "error");
      } finally {
        loading.value = false;
      }
    }
  });
};

watch(
  () => props.currentWorkshop,
  (newWorkshop) => {
    if (newWorkshop) {
      formData.value = {
        name: newWorkshop.name || "",
        address: newWorkshop.address || "",
        phone: newWorkshop.phone || "",
        description: newWorkshop.description || "",
        id: newWorkshop.id || "",
        image: newWorkshop.image ? [{ url: newWorkshop.image }] : [],
      };
    } else {
      resetForm();
    }
  },
);

const handleRemove = () => {
  errorVal.value = true;
};

const handleUpload = (file) => {
  if (file.size / 1024 / 1024 > 0.5) {
    errorVal.value = true;
    return false;
  }
  errorVal.value = false;
  changeImg.value = true;
  return true;
};

const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
</script>
