<template>
  <div
    class="modal fade"
    id="kt_modal_add_year"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("addYear") }}</h2>
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
                $t("addYear")
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
import { ref } from "vue";
import Swal from "sweetalert2";
import { useFetch } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();
const emit = defineEmits(["data"]);

const loading = ref(false);
const dataVal = ref([]);
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

const fetching = async () => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/models`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    dataVal.value = data.value.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetching();

const resetForm = () => {
  formData.value.year = "";
  formData.value.models = [];
  formRef.value.resetFields();
};

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      const formDataToSend = new FormData();
      formDataToSend.append("year", formData.value.year);

      // Add models array as JSON string
      formDataToSend.append("models", formData.value.models);

      try {
        const { data } = await useFetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/years`,
          {
            method: "POST",
            body: formDataToSend,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        ).json();

        emit("data", data.value.data);
        Swal.fire("Year added successfully!", "", "success");
        resetForm();
      } catch (error) {
        Swal.fire("Failed to add year", error.message, "error");
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>
