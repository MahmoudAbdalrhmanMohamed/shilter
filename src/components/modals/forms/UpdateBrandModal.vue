<template>
  <div
    class="modal fade"
    id="kt_modal_update_brand"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Update Brand</h2>
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
                  >Name In Arabic</label
                >
                <el-form-item prop="nameAr">
                  <el-input
                    v-model="formData.nameAr"
                    type="text"
                    placeholder="الاسم باللغة العربية"
                  />
                </el-form-item>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2"
                  >Name In English</label
                >
                <el-form-item prop="nameEn">
                  <el-input
                    v-model="formData.nameEn"
                    type="text"
                    placeholder="Name in English"
                  />
                </el-form-item>
              </div>

              <!-- Repeater for Models with Arabic and English Names and Years -->
              <div id="kt_docs_repeater_nested">
                <div
                  v-for="(model, modelIndex) in formData.models"
                  :key="modelIndex"
                  class="form-group row mb-5"
                >
                  <div class="col-md-4">
                    <label class="required fs-6 fw-semibold mb-2"
                      >Model Name (Arabic):</label
                    >
                    <el-form-item
                      :prop="`models.${modelIndex}.nameAr`"
                      :rules="[
                        {
                          required: true,
                          message: 'Model name in Arabic is required',
                        },
                      ]"
                    >
                      <el-input
                        v-model="model.nameAr"
                        type="text"
                        placeholder="Model name in Arabic"
                      />
                    </el-form-item>
                  </div>

                  <div class="col-md-4">
                    <label class="fs-6 fw-semibold mb-2 required"
                      >Model Name (English):</label
                    >
                    <el-form-item
                      :prop="`models.${modelIndex}.nameEn`"
                      :rules="[
                        {
                          required: true,
                          message: 'Model name in English is required',
                        },
                      ]"
                    >
                      <el-input
                        v-model="model.nameEn"
                        type="text"
                        placeholder="Model name in English"
                      />
                    </el-form-item>
                  </div>

                  <div class="col-md-8">
                    <!-- Year Repeater within Model -->
                    <label class="required fs-6 fw-semibold mb-2"
                      >Model Year:</label
                    >
                    <div
                      v-for="(year, yearIndex) in model.years"
                      :key="yearIndex"
                      class="flex items-stretch"
                    >
                      <el-form-item
                        :prop="`models.${modelIndex}.years.${yearIndex}.year`"
                        :rules="[
                          { required: true, message: 'Year is required' },
                          { validator: validateYear, trigger: 'blur' },
                        ]"
                      >
                        <el-input
                          v-model="year.year"
                          type="text"
                          class="me-3"
                          placeholder="Enter year"
                        />
                      </el-form-item>
                      <button
                        class="btn btn-sm btn-light-danger block h-fit"
                        @click="removeYear(modelIndex, yearIndex)"
                        type="button"
                      >
                        <KTIcon icon-name="trash" icon-class="fs-5" /> Remove
                        Year
                      </button>
                    </div>

                    <button
                      class="btn btn-sm btn-light-primary mt-2"
                      @click="addYear(modelIndex)"
                      type="button"
                    >
                      <KTIcon icon-name="plus" icon-class="fs-5" /> Add Year
                    </button>
                  </div>

                  <div class="col-md-12 text-end mt-3">
                    <button
                      class="btn btn-sm btn-light-danger"
                      @click="removeModel(modelIndex)"
                      type="button"
                    >
                      <KTIcon icon-name="trash" icon-class="fs-5" /> Delete
                      Model
                    </button>
                  </div>
                </div>

                <button
                  class="btn btn-flex btn-light-primary mt-5"
                  @click="addModel"
                  type="button"
                >
                  <KTIcon icon-name="plus" icon-class="fs-3" /> Add Model
                </button>
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
              <span v-if="!loading" class="indicator-label">Update Brand</span>
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
  models: [{ nameAr: "", nameEn: "", years: [{ year: "" }] }],
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

const validateYear = (rule, value, callback) => {
  const yearRegex = /^[0-9]{4}$/;
  if (!value) {
    callback(new Error("Year is required"));
  } else if (!yearRegex.test(value)) {
    callback(new Error("Year must be a 4-digit number"));
  } else {
    callback();
  }
};

const addModel = () => {
  formData.value.models.push({
    nameAr: "",
    nameEn: "",
    years: [{ year: "" }],
  });
};

const removeModel = (index) => {
  formData.value.models.splice(index, 1);
};

const addYear = (modelIndex) => {
  formData.value.models[modelIndex].years.push({ year: "" });
};

const removeYear = (modelIndex, yearIndex) => {
  formData.value.models[modelIndex].years.splice(yearIndex, 1);
};

const resetForm = () => {
  formData.value = {
    nameAr: "",
    nameEn: "",
    models: [{ nameAr: "", nameEn: "", years: [{ year: "" }] }],
  };
  formRef.value.resetFields();
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      emit("updateData", formData.value);
      setTimeout(() => {
        loading.value = false;
        Swal.fire({
          text: "Form has been successfully submitted!",
          icon: "success",
          confirmButtonText: "Ok, got it!",
          customClass: { confirmButton: "btn btn-primary" },
        });
        resetForm();
      }, 1500);
    }
  });
};

watch(
  () => props.currentBrand,
  (newBrand) => {
    if (newBrand && Object.keys(newBrand).length > 0) {
      formData.value = {
        nameAr: newBrand.name,
        nameEn: newBrand.name,
        models: newBrand.models.map((model) => ({
          nameAr: model.name,
          nameEn: model.name,
          years:
            model.years && model.years.length > 0
              ? model.years.map((year) => ({ year: year.year || "" }))
              : [{ year: "" }],
        })),
      };
    } else {
      resetForm();
    }
  },
);
</script>
