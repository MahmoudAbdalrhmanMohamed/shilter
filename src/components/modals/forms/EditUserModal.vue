<template>
  <div
    id="kt_modal_edit_user"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("editUser") }}</h5>
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
            <!-- User Name -->
            <el-form-item prop="name">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("name")
              }}</label>
              <el-input v-model="formData.name" placeholder="Enter user name" />
            </el-form-item>

            <!-- Email -->
            <el-form-item prop="email">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("email")
              }}</label>
              <el-input
                v-model="formData.email"
                type="email"
                placeholder="Enter user email"
              />
            </el-form-item>

            <!-- Role -->
            <el-form-item prop="role">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("role")
              }}</label>
              <el-select
                v-model="formData.role"
                filterable
                placeholder="Select user role"
              >
                <el-option label="Admin" value="Admin" />
                <el-option label="Editor" value="Editor" />
                <el-option label="Viewer" value="Viewer" />
              </el-select>
            </el-form-item>

            <!-- Status -->
            <el-form-item prop="status">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("status")
              }}</label>
              <el-select
                v-model="formData.status"
                filterable
                placeholder="Select status"
              >
                <el-option label="Active" value="Active" />
                <el-option label="Inactive" value="Inactive" />
              </el-select>
            </el-form-item>

            <!-- Photo Upload -->
            <el-form-item prop="photo">
              <label class="fs-6 fw-semibold mb-2">{{ $t("photo") }}</label>
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
                  {{ $t("uploadPhoto") }}
                </el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-light"
            data-bs-dismiss="modal"
            aria-label="Close Modal"
          >
            {{ $t("cancel") }}
          </button>
          <button class="btn btn-primary" @click="submit">
            {{ $t("saveChanges") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  user: Object,
});

const emit = defineEmits(["close", "update-user"]);

const formData = ref({ ...props.user });
const photoFileList = ref([]); // File list for the photo upload

// Watch for changes in the user prop and update formData
watch(
  () => props.user,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };

      // Populate photo file list if a photo URL exists
      photoFileList.value = newData.photo
        ? [{ name: "Photo", url: newData.photo }]
        : [];
    }
  },
);

const formRef = ref(null);

// Validation rules
const rules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Enter a valid email", trigger: "blur" },
  ],
  role: [{ required: true, message: "Role is required", trigger: "change" }],
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
      emit("update-user", formData.value); // Emit updated user data
      emit("close"); // Close the modal
    }
  });
};
</script>

<style scoped>
/* Styles for photo upload */
.upload-demo .el-upload__input {
  display: none;
}
</style>
