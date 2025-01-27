<template>
  <div
    class="modal fade"
    id="kt_modal_add_model"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("addModel") }}</h2>
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
                  $t("Brand Name")
                }}</label>
                <el-form-item prop="brandName">
                  <el-select
                    filterable
                    v-model="formData.brandName"
                    type="text"
                  >
                    <el-option
                      v-for="brand in tableData"
                      :key="brand.id"
                      :label="locale === 'ar' ? brand.name.ar : brand.name.en"
                      :value="brand.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <!-- Model Information -->
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

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("Select Years")
                }}</label>
                <el-form-item prop="selectedYears">
                  <el-select
                    v-model="formData.selectedYears"
                    :placeholder="$t('Select Years')"
                    filterable
                    multiple
                  >
                    <el-option
                      v-for="year in years"
                      :key="year"
                      :label="year"
                      :value="year"
                    />
                  </el-select>
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
                $t("addModel")
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
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { hideModal } from "@/core/helpers/modal";

const { locale } = useI18n();
const tableData = ref();
const emit = defineEmits(["data"]);
const loading = ref(false);
const formRef = ref(null);
const formData = ref({
  brandName: "",
  nameAr: "",
  nameEn: "",
  selectedYears: [], // Store selected years
});

const fetchingAllPages = async () => {
  try {
    // Initialize tableData as an empty array
    tableData.value = [];

    // Fetch the first page to get the total number of pages
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands?page=1`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();

    // Extract total pages from metadata
    const totalPages = data.value.data.meta.total_pages;

    // Add data from the first page
    tableData.value.push(...data.value.data.data);

    // Fetch the remaining pages
    const promises = [];
    for (let page = 2; page <= totalPages; page++) {
      promises.push(
        useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands?page=${page}`,
          {
            method: "GET",
            headers: {
              "X-localization": locale.value,
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        ).json(),
      );
    }

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Consolidate data from all pages
    results.forEach(({ data: pageData }) => {
      tableData.value.push(...pageData.value.data.data);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Call the function to fetch all pages
fetchingAllPages();

// Watch for locale changes and re-fetch data if needed
watch(locale, async () => {
  await fetchingAllPages();
});

// Generate years dynamically
const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => 1970 + i);

// Validation rules
const rules = {
  brandName: [
    {
      required: true,
      message: "brand name is required",
      trigger: "change",
    },
  ],
  nameAr: [
    {
      required: true,
      message: "Model name in Arabic is required",
      trigger: "change",
    },
  ],
  nameEn: [
    {
      required: true,
      message: "Model name in English is required",
      trigger: "change",
    },
  ],
  selectedYears: [
    {
      type: "array",
      required: true,
      message: "Please select at least one year",
      trigger: "change",
    },
  ],
};

const resetForm = () => {
  formData.value = {
    brandName: "",
    nameAr: "",
    nameEn: "",
    selectedYears: [], // Reset years
  };
  formRef.value.resetFields();
};

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const { data } = await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/models`,
        {
          method: "POST",
          body: JSON.stringify({
            name: {
              ar: formData.value.nameAr,
              en: formData.value.nameEn,
            },
            brand_id: formData.value.brandName,
            years: formData.value.selectedYears,
          }),
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      loading.value = false;
      Swal.fire("Form submitted successfully!", "", "success");
      hideModal("#kt_modal_add_model");

      emit("data", data.value.data);
      resetForm();
    }
  });
};
</script>
