<template>
  <div
    id="kt_modal_edit_chapter"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("Edit Chapter") }}</h5>
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
            <!-- Chapter Name -->
            <el-form-item prop="chapterName">
              <label class="required fs-6 fw-semibold mb-2">
                {{ $t("Chapter Name") }}
              </label>
              <el-input
                v-model="formData.chapterName"
                placeholder="Enter chapter name"
              />
            </el-form-item>

            <!-- Chapter Number -->
            <el-form-item prop="chapterNumber">
              <label class="required fs-6 fw-semibold mb-2">
                {{ $t("Chapter Number") }}
              </label>
              <el-input-number
                class="w-full"
                v-model="formData.chapterNumber"
                placeholder="Enter chapter number"
                :min="1"
              />
            </el-form-item>

            <!-- Language -->
            <el-form-item prop="language">
              <label class="required fs-6 fw-semibold mb-2">
                {{ $t("Language") }}
              </label>
              <el-select
                v-model="formData.language"
                filterable
                placeholder="Select language"
              >
                <el-option label="Arabic" value="ar" />
                <el-option label="English" value="en" />
                <el-option label="Chinese" value="zh" />
                <el-option label="Hindi" value="hi" />
                <el-option label="Italian" value="it" />
                <el-option label="Spanish" value="es" />
                <el-option label="Russian" value="ru" />
                <el-option label="Turkish" value="tr" />
                <el-option label="French" value="fr" />
                <el-option label="German" value="de" />
              </el-select>
            </el-form-item>

            <!-- Chapter PDF -->
            <el-form-item prop="chapterPDF">
              <label class="required fs-6 fw-semibold mb-2">
                {{ $t("Chapter PDF") }}
              </label>
              <el-upload
                v-model:file-list="chapterPdfFiles"
                class="upload-demo w-full"
                :limit="1"
                accept=".pdf"
                list-type="text"
                :auto-upload="false"
                :on-change="handleUpload('chapterPDF')"
                :on-remove="handleRemove('chapterPDF')"
              >
                <el-button type="primary">
                  {{ $t("Upload PDF") }}
                </el-button>
              </el-upload>
            </el-form-item>

            <!-- Chapter Cover -->
            <el-form-item prop="chapterCover">
              <label class="required fs-6 fw-semibold mb-2">
                {{ $t("Chapter Cover") }}
              </label>
              <el-upload
                v-model:file-list="chapterCoverFiles"
                class="upload-demo w-full"
                :limit="1"
                accept=".jpg,.png"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleUpload('chapterCover')"
                :on-preview="handlePreview"
                :on-remove="handleRemove('chapterCover')"
              >
                <el-button type="primary">
                  {{ $t("Upload Cover") }}
                </el-button>
              </el-upload>
            </el-form-item>

            <!-- Status -->
            <el-form-item prop="status">
              <label class="required fs-6 fw-semibold mb-2">
                {{ $t("Status") }}
              </label>
              <el-select
                v-model="formData.status"
                filterable
                placeholder="Select status"
              >
                <el-option label="Approved" value="Approved" />
                <el-option label="Pending" value="Pending" />
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

  <!-- Image Preview Dialog -->
  <el-dialog v-model="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { ElForm } from "element-plus";

const props = defineProps({
  chapter: Object,
});

const emit = defineEmits(["close", "update-chapter"]);

const formData = ref({ ...props.chapter });
const chapterPdfFiles = ref([]);
const chapterCoverFiles = ref([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

watch(
  () => props.chapter,
  (newData) => {
    formData.value = { ...newData };

    // Initialize file lists with current chapter values
    chapterPdfFiles.value = newData.chapterPDF
      ? [{ name: "Chapter PDF", url: newData.chapterPDF }]
      : [];
    chapterCoverFiles.value = newData.chapterCover
      ? [{ name: "Chapter Cover", url: newData.chapterCover }]
      : [];
  },
);

const rules = {
  chapterName: [
    { required: true, message: "Chapter Name is required", trigger: "blur" },
  ],
  chapterNumber: [
    { required: true, message: "Chapter Number is required", trigger: "blur" },
  ],
  language: [
    { required: true, message: "Language is required", trigger: "change" },
  ],
  status: [
    { required: true, message: "Status is required", trigger: "change" },
  ],
  chapterPDF: [
    { required: true, message: "Chapter PDF is required", trigger: "change" },
  ],
  chapterCover: [
    { required: true, message: "Chapter Cover is required", trigger: "change" },
  ],
};

// Handle file upload
const handleUpload = (type) => (file) => {
  if (type === "chapterPDF") {
    formData.value.chapterPDF = file.raw;
  } else if (type === "chapterCover") {
    formData.value.chapterCover = file.raw;
  }
};

// Handle file removal
const handleRemove = (type) => () => {
  if (type === "chapterPDF") {
    formData.value.chapterPDF = null;
  } else if (type === "chapterCover") {
    formData.value.chapterCover = null;
  }
};

// Handle image preview
const handlePreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

// Submit form
const submit = () => {
  formData.value.validate((valid) => {
    if (!valid) return;

    // Validate files
    if (!formData.value.chapterPDF) {
      Swal.fire({
        text: "Please upload a Chapter PDF.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.value.chapterCover) {
      Swal.fire({
        text: "Please upload a Chapter Cover.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Emit updated chapter data
    emit("update-chapter", formData.value);
    emit("close");
  });
};
</script>
