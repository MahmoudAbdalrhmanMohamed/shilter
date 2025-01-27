<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="update_comic_form"
      @submit="onSubmitComic"
      :validation-schema="comicSchema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("updateComic") }}
        </h1>
      </div>

      <!-- Name -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("name")
        }}</label>
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="name"
          v-model="formValues.name"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="name" />
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("description")
        }}</label>
        <Field
          tabindex="2"
          as="textarea"
          class="form-control form-control-lg form-control-solid"
          name="description"
          v-model="formValues.description"
          rows="4"
          autocomplete="off"
        />
        <small class="text-gray-500">
          {{ formValues.description.length || 0 }}/50 characters
        </small>
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="description" />
          </div>
        </div>
      </div>

      <!-- Artists (Multi-Select) -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("artists")
        }}</label>
        <Field name="artists" v-slot="{ field }">
          <el-select
            v-model="formValues.artists"
            v-bind="field"
            multiple
            placeholder="Select Artists"
            size="large"
            class="form-control-solid"
            tabindex="3"
            name="artists"
          >
            <el-option
              v-for="artist in artists"
              :key="artist.id"
              :label="artist.name[locale]"
              :value="artist.id"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="artists" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Genres (Multi-Select) -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("genres")
        }}</label>
        <Field name="genres" v-slot="{ field }">
          <el-select
            v-model="formValues.genres"
            v-bind="field"
            multiple
            placeholder="Select Genres"
            size="large"
            class="form-control-solid"
            tabindex="4"
            name="genres"
          >
            <el-option
              v-for="genre in genres"
              :key="genre.id"
              :label="genre.name[locale]"
              :value="genre.id"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="genres" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Publisher (Single Select) -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("publisher")
        }}</label>
        <Field name="publisher" v-slot="{ field }">
          <el-select
            v-model="formValues.publisher"
            v-bind="field"
            placeholder="Select Publisher"
            size="large"
            class="form-control-solid"
            tabindex="5"
            name="publisher"
          >
            <el-option
              v-for="publisher in publishers"
              :key="publisher.id"
              :label="publisher.name[locale]"
              :value="publisher.id"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="publisher" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Writer (Single Select) -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("writer")
        }}</label>
        <Field name="writer" v-slot="{ field }">
          <el-select
            v-model="formValues.writer"
            v-bind="field"
            placeholder="Select Writer"
            size="large"
            class="form-control-solid"
            tabindex="6"
            name="writer"
          >
            <el-option
              v-for="writer in writers"
              :key="writer.id"
              :label="writer.name[locale]"
              :value="writer.id"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="writer" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Year -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("year")
        }}</label>
        <Field
          tabindex="7"
          class="form-control form-control-lg form-control-solid"
          type="number"
          name="year"
          v-model="formValues.year"
          autocomplete="off"
        />
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="year" />
          </div>
        </div>
      </div>

      <!-- Image Upload -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("image")
        }}</label>
        <el-upload
          v-model:file-list="formValues.imageFiles"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          accept=".jpg,.png"
          list-type="picture-card"
          :on-change="handleImageChange"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
        >
          <el-button type="primary">{{ $t("uploadImage") }}</el-button>
          <template v-if="errorVal" #tip>
            <div class="el-upload__tip text-red-500">
              {{ $t("invalidImageError") }}
            </div>
          </template>
        </el-upload>
      </div>

      <!-- Language (Single Select) -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("language")
        }}</label>
        <Field name="language" v-slot="{ field }">
          <el-select
            v-model="formValues.language"
            v-bind="field"
            placeholder="Select Language"
            size="large"
            class="form-control-solid"
            tabindex="8"
            name="language"
          >
            <el-option
              v-for="language in languages"
              :key="language.code"
              :label="language.lang"
              :value="language.code"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="language" />
            </div>
          </div>
        </Field>
      </div>

      <!-- Actions -->
      <div class="text-center">
        <button
          tabindex="10"
          type="submit"
          ref="submitButton"
          id="kt_update_comic_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("updateComic") }}</span>
          <span class="indicator-progress">
            {{ $t("pleaseWait") }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </VForm>

    <!-- Image Preview Dialog -->
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
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
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();

const loading = ref(false);
const submitButton = ref(null);
const errorVal = ref(false);
const formValues = ref({
  name: "",
  description: "",
  artists: [],
  genres: [],
  publisher: "",
  writer: "",
  year: "",
  language: "",
  imageFiles: [],
});

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const artists = ref([]);
const genres = ref([]);
const publishers = ref([]);
const writers = ref([]);
const languages = [
  { lang: "arabic", code: "ar" },
  { lang: "english", code: "en" },
  { lang: "chinese", code: "zh" },
  { lang: "indian", code: "hi" },
  { lang: "italian", code: "it" },
  { lang: "spanish", code: "es" },
  { lang: "russian", code: "ru" },
  { lang: "turkish", code: "tr" },
  { lang: "french", code: "fr" },
  { lang: "german", code: "de" },
];

const comicSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(4, "Name must be at least 4 characters")
    .label("Name"),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .min(50, "Description must be at least 50 characters")
    .required("Description is required")
    .label("Description"),
  artists: Yup.array()
    .min(1, "At least one artist is required")
    .required("Artists are required")
    .label("Artists"),
  genres: Yup.array()
    .min(1, "At least one genre is required")
    .required("Genres are required")
    .label("Genres"),
  publisher: Yup.string().required("Publisher is required").label("Publisher"),
  writer: Yup.string().required("Writer is required").label("Writer"),
  year: Yup.number().required("Year is required").label("Year"),
  language: Yup.string().required("Language is required").label("Language"),
});

const handleImageChange = (file) => {
  if (file.size / 1024 / 1024 > 1) {
    errorVal.value = true;
    return false;
  }
  errorVal.value = false;
  return true;
};

const handleRemove = () => {
  errorVal.value = false;
};

const handlePreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url;
  dialogVisible.value = true;
};

const fetchComicData = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/comics/${route.params.updateComic}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch comic data.");
    }

    const data = await response.json();
    formValues.value = {
      ...data.data,
      artists: data.data.artists.map((artist) => artist.id),
      genres: data.data.genres.map((genre) => genre.id),
      publisher: data.data.publisher.id,
      writer: data.data.writer.id,
      imageFiles: data.data.image ? [{ url: data.data.image }] : [],
    };
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
    loading.value = false;
  }
};

const onSubmitComic = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    // Create a FormData object
    const formData = new FormData();

    // Append text fields to FormData
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("year", values.year);
    formData.append("language_code", values.language);
    formData.append("status", "ongoing");

    // Append arrays (artists and genres)
    values.artists.forEach((artist) => formData.append("artists[]", artist));
    values.genres.forEach((genre) => formData.append("genres[]", genre));

    // Append publisher and writer
    formData.append("publisher_id", values.publisher);
    formData.append("writer_id", values.writer);

    // Append the image file if a new one is uploaded
    if (
      formValues.value.imageFiles.length > 0 &&
      formValues.value.imageFiles[0].raw
    ) {
      const file = formValues.value.imageFiles[0].raw;
      formData.append("image_file", file);
    }

    // Send the request with FormData
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/comics/${route.params.updateComic}`,
      {
        method: "PUT", // Use PUT or PATCH depending on your API
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Comic successfully updated!",
        icon: "success",
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-primary",
        },
      }).then(() => {
        router.push({ name: "apps-comics-all" });
      });
    } else {
      throw new Error(data?.message || "Failed to update comic.");
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

const fetchingPublishers = async () => {
  try {
    loading.value = true;
    let allPublishers = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/publishers?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch publishers.");
      }

      const data = await response.json();
      allPublishers = [...allPublishers, ...data.data.data];
      totalPages = data.data.meta.total_pages;
      page++;
    } while (page <= totalPages);

    publishers.value = allPublishers;
  } catch (error) {
    console.error("Error fetching publishers:", error);
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
    loading.value = false;
  }
};
const fetchingArtists = async () => {
  try {
    loading.value = true;
    let allArtists = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/artists?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch artists.");
      }

      const data = await response.json();
      allArtists = [...allArtists, ...data.data.data];
      totalPages = data.data.meta.total_pages;
      page++;
    } while (page <= totalPages);

    artists.value = allArtists;
  } catch (error) {
    console.error("Error fetching artists:", error);
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
    loading.value = false;
  }
};
const fetchingGeneres = async () => {
  try {
    loading.value = true;
    let allGenres = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/genres?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch genres.");
      }

      const data = await response.json();
      allGenres = [...allGenres, ...data.data.data];
      totalPages = data.data.meta.total_pages;
      page++;
    } while (page <= totalPages);

    genres.value = allGenres;
  } catch (error) {
    console.error("Error fetching genres:", error);
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
    loading.value = false;
  }
};
const fetchingWriters = async () => {
  try {
    loading.value = true;
    let allWriters = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL_NEW}/writers?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch writers.");
      }

      const data = await response.json();
      allWriters = [...allWriters, ...data.data.data];
      totalPages = data.data.meta.total_pages;
      page++;
    } while (page <= totalPages);

    writers.value = allWriters;
  } catch (error) {
    console.error("Error fetching writers:", error);
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
    loading.value = false;
  }
};

fetchComicData();
fetchingPublishers();
fetchingArtists();
fetchingGeneres();
fetchingWriters();
</script>
