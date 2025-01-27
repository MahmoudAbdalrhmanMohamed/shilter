<template>
  <div
    class="modal fade"
    id="kt_modal_update_year"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div v-if="!loading" class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("updateYear") }}</h2>
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
              <!-- Year Input -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("year")
                }}</label>
                <el-form-item prop="year">
                  <el-input
                    v-model="formData.year"
                    type="text"
                    :placeholder="$t('enterYear')"
                  />
                </el-form-item>
              </div>

              <!-- Multi-Select Models Dropdown -->
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("models")
                }}</label>
                <el-form-item prop="models">
                  <el-select
                    v-model="formData.models"
                    multiple
                    filterable
                    :placeholder="$t('selectModels')"
                    :class="locale === 'ar' ? '*:text-right' : ''"
                  >
                    <el-option
                      v-for="data in dataVal"
                      :key="data.id"
                      :label="locale === 'ar' ? data.name.ar : data.name.en"
                      :value="data.id"
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
                $t("updateYear")
              }}</span>
              <span v-else class="indicator-progress">
                {{ "pleaseWait" }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </el-form>
      </div>
    </div>
    <div v-else class="grid place-items-center w-screen h-screen">
      <span class="loading"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
const dataVal = ref([]);
const idRef = ref();

const { locale } = useI18n();

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
  year: "",
  models: [], // Store selected model IDs
});

const rules = {
  year: [
    {
      required: true,
      message: "Year is required",
      trigger: "blur",
    },
  ],
  models: [
    {
      required: true,
      message: "Please select at least one model",
      trigger: "blur",
    },
  ],
};

const resetForm = () => {
  formData.value = {
    year: "",
    models: [],
  };
  formRef.value?.resetFields();
};

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      emit("updateData", formData.value);
      const formDataToSend = new formData();
      formDataToSend.append("year", formData.value.year);
      formDataToSend.append("models", formData.value.models);
      await useFetch(
        `${import.meta.env.VITE_APP_API_URL_MEGATRON}/years/${idRef.value}?_method="PUT"`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      loading.value = false;
      Swal.fire({
        text: "Form Submitted",
        icon: "success",
        confirmButtonText: "Ok Got It",
        customClass: { confirmButton: "btn btn-primary" },
      });
      resetForm();
    }
  });
};

// const fetchServiceName = async (id, lang) => {
//   loading.value = true;
//   const { data } = await useFetch(
//     `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands/${id}`,
//     {
//       headers: {
//         "X-localization": lang,
//         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//       },
//     },
//   ).json();
//   loading.value = false;
//   return data.value.data.name;
// };

// Watch for changes to currentBrand
watch(
  () => props.currentBrand,
  async (newBrand) => {
    idRef.value = newBrand.id;

    formData.value = {
      year: newBrand.year,
      models: newBrand.models,
    };
  },
);
</script>
