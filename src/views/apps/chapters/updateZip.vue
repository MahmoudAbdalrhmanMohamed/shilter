<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <div class="text-center mb-10">
      <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
        {{ $t("updateZipFile") }}
      </h1>
    </div>

    <!-- Form -->
    <VForm
      class="form w-full"
      id="update_zip_form"
      @submit="onSubmitUpdateZip"
      :validation-schema="zipSchema"
    >
      <!-- Comic Name -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("comicName")
        }}</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          v-model="formValues.comicName"
          name="comicName"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="comicName" />
          </div>
        </div>
      </div>

      <!-- Chapter Name -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("chapterName")
        }}</label>
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="text"
          v-model="formValues.chapterName"
          name="chapterName"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="chapterName" />
          </div>
        </div>
      </div>

      <!-- Date Picker -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("date")
        }}</label>
        <div>
          <el-date-picker
            v-model="formValues.date"
            type="date"
            placeholder="Select a date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="form-control form-control-lg form-control-solid"
          />
        </div>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="date" />
          </div>
        </div>
      </div>

      <!-- Start -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("start")
        }}</label>
        <Field
          tabindex="4"
          class="form-control form-control-lg form-control-solid"
          type="number"
          v-model="formValues.start"
          name="start"
          min="0"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="start" />
          </div>
        </div>
      </div>

      <!-- End -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("end")
        }}</label>
        <Field
          tabindex="5"
          class="form-control form-control-lg form-control-solid"
          type="number"
          v-model="formValues.end"
          name="end"
          min="0"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="end" />
          </div>
        </div>
      </div>

      <!-- Upload ZIP -->
      <div class="fv-row mb-5">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("uploadZip")
        }}</label>
        <el-upload
          class="upload-demo"
          drag
          action=""
          :auto-upload="false"
          accept=".zip"
          v-model:file-list="fileList"
          :on-change="handleFileChange"
          list-type="text"
        >
          <div class="el-upload-dragger">
            <i class="el-icon-upload"></i>
            <p>Click or drag ZIP file to upload</p>
          </div>
        </el-upload>
        <div v-if="fileError" class="text-danger mt-2">{{ fileError }}</div>
      </div>

      <!-- Submit -->
      <div class="text-center">
        <button
          tabindex="6"
          type="submit"
          ref="submitButton"
          id="kt_update_zip_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateZipFile") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>
  </div>
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { ElDatePicker, ElUpload } from "element-plus";

const loading = ref(false);
const router = useRouter();
const route = useRoute();
const submitButton = ref(null);
const fileList = ref([]);
const fileError = ref("");

// Form data
const formValues = ref({
  comicName: "",
  chapterName: "",
  date: "",
  start: null,
  end: null,
});

// Validation schema for the form
const zipSchema = Yup.object().shape({
  comicName: Yup.string().required("Comic Name is required"),
  chapterName: Yup.string().required("Chapter Name is required"),
  date: Yup.date().required("Date is required").nullable(),
  start: Yup.number()
    .required("Start is required")
    .min(0, "Start must be at least 0"),
  end: Yup.number()
    .required("End is required")
    .min(0, "End must be at least 0"),
});

// Fetch existing ZIP data
const fetchZipData = async () => {
  try {
    loading.value = true;

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/upload/zip/${route.params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok && data) {
      formValues.value = {
        comicName: data.comicName,
        chapterName: data.chapterName,
        date: data.date,
        start: data.start,
        end: data.end,
      };
    } else {
      throw new Error(data?.message || "Failed to fetch ZIP data.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Go Back",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    }).then(() => {
      router.push({ name: "apps-uploads-all" });
    });
  } finally {
    loading.value = false;
  }
};

// Handle ZIP file change
const handleFileChange = (file) => {
  if (file.raw && file.raw.type === "application/zip") {
    fileError.value = "";
    return true;
  } else {
    fileError.value = "Please upload a valid ZIP file.";
    return false;
  }
};

// Submit updated ZIP data
const onSubmitUpdateZip = async () => {
  if (fileList.value.length === 0) {
    fileError.value = "ZIP file is required.";
    return;
  }

  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("comicName", formValues.value.comicName);
    formData.append("chapterName", formValues.value.chapterName);
    formData.append("date", formValues.value.date);
    formData.append("start", formValues.value.start);
    formData.append("end", formValues.value.end);
    formData.append("file", fileList.value[0].raw);

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/upload/zip/${route.params.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "ZIP file successfully updated!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-uploads-all" });
      });
    } else {
      throw new Error(data?.message || "Failed to update ZIP file.");
    }
  } catch (error) {
    Swal.fire({
      text: error.message || "Something went wrong!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Try again!",
      heightAuto: false,
      customClass: {
        confirmButton: "btn fw-semibold btn-light-danger",
      },
    });
  } finally {
    if (submitButton.value) {
      submitButton.value.removeAttribute("data-kt-indicator");
      submitButton.value.disabled = false;
      loading.value = false;
    }
  }
};

fetchZipData();
</script>
