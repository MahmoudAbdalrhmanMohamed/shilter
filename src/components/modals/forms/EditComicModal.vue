<template>
  <div
    id="kt_modal_edit_comic"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("Edit Comic") }}</h5>
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
            <el-form-item prop="description">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Description")
              }}</label>
              <el-input
                v-model="formData.description"
                placeholder="Enter description"
                :rows="4"
                type="textarea"
              />
            </el-form-item>
            <el-form-item prop="publisher">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Publisher")
              }}</label>
              <el-input
                v-model="formData.publisher"
                placeholder="Enter publisher"
              />
            </el-form-item>
            <el-form-item prop="genre">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Genre")
              }}</label>
              <el-input v-model="formData.genre" placeholder="Enter genre" />
            </el-form-item>
            <el-form-item prop="artist">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Artist")
              }}</label>
              <el-input v-model="formData.artist" placeholder="Enter artist" />
            </el-form-item>
            <el-form-item prop="writer">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Writer")
              }}</label>
              <el-input v-model="formData.writer" placeholder="Enter writer" />
            </el-form-item>
            <el-form-item prop="status">
              <label class="required fs-6 fw-semibold mb-2">{{
                $t("Status")
              }}</label>
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
</template>

<script setup>
import { ref } from "vue";
import { ElForm } from "element-plus";
import { useI18n } from "vue-i18n";
import { watch } from "vue";
const { locale } = useI18n();

const props = defineProps({
  comic: Object,
});

const emit = defineEmits(["close", "update-comic"]);

const formData = ref({ ...props.comic });

watch(
  () => props.comic, // Watch the comic prop for changes
  (newData) => {
    formData.value = { ...newData }; // Update formData with the new comic data
  },
);

const formRef = ref(null);

const rules = {
  description: [
    { required: true, message: "Description is required", trigger: "blur" },
  ],
  publisher: [
    { required: true, message: "Publisher is required", trigger: "blur" },
  ],
  genre: [{ required: true, message: "Genre is required", trigger: "blur" }],
  artist: [{ required: true, message: "Artist is required", trigger: "blur" }],
  writer: [{ required: true, message: "Writer is required", trigger: "blur" }],
  status: [
    { required: true, message: "Status is required", trigger: "change" },
  ],
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      emit("update-comic", formData.value);
      emit("close");
    }
  });
};
</script>
