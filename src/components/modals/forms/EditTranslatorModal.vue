<template>
  <div
    id="kt_modal_edit_translator"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("Edit Translator") }}</h5>
          <button
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            aria-label="Close Modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>
        <div class="modal-body">
          <el-form :model="formData" :rules="rules" ref="formRef">
            <!-- Translator Name -->
            <el-form-item prop="name">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Translator Name")
              }}</label>
              <el-input
                v-model="formData.name"
                placeholder="Enter translator name"
              />
            </el-form-item>

            <!-- Language -->
            <el-form-item prop="language">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Language")
              }}</label>
              <el-select
                v-model="formData.language"
                filterable
                placeholder="Select language"
              >
                <el-option label="Arabic" value="ar" />
                <el-option label="English" value="en" />
                <el-option label="Chinese" value="zh" />
                <el-option label="Hindi" value="hi" />
                <el-option label="Italian" value="italy" />
                <el-option label="Spanish" value="es" />
                <el-option label="Russian" value="ru" />
                <el-option label="Turkish" value="tr" />
                <el-option label="French" value="fr" />
                <el-option label="German" value="de" />
              </el-select>
            </el-form-item>

            <!-- Email -->
            <el-form-item prop="email">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Email")
              }}</label>
              <el-input v-model="formData.email" placeholder="Enter email" />
            </el-form-item>

            <!-- Photo Upload -->
            <el-form-item prop="photo">
              <label class="fs-6 fw-semibold mb-2">{{ $t("Photo") }}</label>
              <el-upload
                class="upload-demo w-full"
                :file-list="photoFileList"
                :limit="1"
                accept=".jpg,.png"
                list-type="picture-card"
                :on-change="handlePhotoUpload"
                :on-remove="handlePhotoRemove"
                :auto-upload="false"
              >
                <el-button type="primary">
                  {{ $t("Upload Photo") }}
                </el-button>
              </el-upload>
            </el-form-item>

            <!-- Status -->
            <el-form-item prop="status">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Status")
              }}</label>
              <el-select
                v-model="formData.status"
                filterable
                placeholder="Select status"
              >
                <el-option label="Pending" value="Pending" />
                <el-option label="Approved" value="Approved" />
                <el-option label="Rejected" value="Rejected" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-light"
            data-bs-dismiss="modal"
            aria-label="Close Modal"
          >
            {{ $t("Cancel") }}
          </button>
          <button class="btn btn-primary" @click="submit">
            {{ $t("Save") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  translator: Object,
});

const emit = defineEmits(["close", "update-translator"]);

const formData = ref({ ...props.translator });
const photoFileList = ref([]); // File list for the photo upload

watch(
  () => props.translator,
  (newData) => {
    console.log("Received translator data:", props.translator); // Debugging
    formData.value = { ...newData };
    photoFileList.value = newData.photo
      ? [{ name: "Photo", url: newData.photo }]
      : [];
  },
);
const formRef = ref(null);

const rules = {
  name: [
    { required: true, message: "Translator Name is required", trigger: "blur" },
  ],
  language: [
    { required: true, message: "Language is required", trigger: "change" },
  ],
  email: [{ required: true, message: "Email is required", trigger: "blur" }],
  status: [
    { required: true, message: "Status is required", trigger: "change" },
  ],
};

// Handle photo upload
const handlePhotoUpload = (file) => {
  formData.value.photo = file.raw; // Update the raw file in formData
};

// Handle photo removal
const handlePhotoRemove = () => {
  formData.value.photo = null; // Clear the photo in formData
};

// Submit form
const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit("update-translator", formData.value); // Emit updated translator data
      emit("close"); // Close the modal
    }
  });
};
</script>
