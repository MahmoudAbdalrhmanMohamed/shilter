<template>
  <div
    class="modal fade"
    id="kt_modal_update_model"
    ref="updateCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div v-if="!loading" class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("updateModel") }}</h2>
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
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_update_customer_scroll"
            >
              <!-- Brand Dropdown -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("Brand Name")
                }}</label>
                <el-form-item prop="brandName">
                  <el-select
                    filterable
                    v-model="formData.brandName"
                    placeholder="Select a Brand"
                    :loading="loadingBrands"
                  >
                    <el-option
                      v-for="brand in brands"
                      :key="brand.id"
                      :label="locale === 'ar' ? brand.name.ar : brand.name.en"
                      :value="brand.id"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <!-- Model Name in Arabic -->
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

              <!-- Model Name in English -->
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

              <!-- Years Selection -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("Select Years")
                }}</label>
                <el-form-item prop="selectedYears">
                  <el-select
                    v-model="formData.selectedYears"
                    placeholder="Select Years"
                    multiple
                    filterable
                    value-key="id"
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
                $t("updateModel")
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
    <div class="w-screen h-screen grid place-items-center" v-else>
      <span class="loader"></span>
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
const emit = defineEmits(["updateData"]);
const props = defineProps({
  currentBrand: {
    type: Object,
    default: () => ({}),
  },
});

const loading = ref(false);
const loadingBrands = ref(false);
const formRef = ref(null);
const idRef = ref();

const formData = ref({
  brandName: "",
  nameAr: "",
  nameEn: "",
  selectedYears: [],
});

const brands = ref([]);
const years = Array.from({ length: 2025 - 1970 + 1 }, (_, i) => 1970 + i);

// Validation rules
const rules = {
  brandName: [
    { required: true, message: "Brand name is required", trigger: "change" },
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
      validator: (_, value, callback) => {
        if (!value || value.length === 0) {
          callback(new Error("Please select at least one year"));
        } else {
          callback();
        }
      },
    },
  ],
};

const fetchingAllPages = async () => {
  try {
    // Initialize tableData as an empty array
    brands.value = [];

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
    brands.value.push(...data.value.data.data);

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
      brands.value.push(...pageData.value.data.data);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loadingBrands.value = false;
  }
};

fetchingAllPages();

watch(locale, async () => {
  await fetchingAllPages();
});
// Populate form with current model data
watch(
  () => props.currentBrand,
  (newBrand) => {
    if (newBrand?.id) {
      loading.value = true;
      idRef.value = newBrand.id;

      formData.value = {
        brandName: newBrand.brand,
        nameAr: newBrand.name.ar,
        nameEn: newBrand.name.en,
        selectedYears: newBrand.years.map((y) => Number(y.year)), // Assuming `newBrand.years` is an array of numbers
      };
      loading.value = false;
    }
  },
);

// Reset form
const resetForm = () => {
  formData.value = {
    brandName: "",
    nameAr: "",
    nameEn: "",
    selectedYears: [],
  };
  formRef.value?.resetFields();
};

// Submit updated model
const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      try {
        console.log({
          name: {
            ar: formData.value.nameAr,
            en: formData.value.nameEn,
          },
          brand_id: formData.value.brandName.id, // Send the selected brand_id
          years: formData.value.selectedYears, // Directly send array of numbers
        });

        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/models/${idRef.value}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({
              name: {
                ar: formData.value.nameAr,
                en: formData.value.nameEn,
              },
              brand_id: formData.value.brandName.id, // Send the selected brand_id
              years: formData.value.selectedYears, // Directly send array of numbers
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update model");
        }

        emit("updateData", data.data); // Emit updated data
        Swal.fire("Model updated successfully!", "", "success");
        hideModal("#kt_modal_update_model");
        resetForm();
      } catch (error) {
        Swal.fire("Failed to update model", error.message, "error");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>
