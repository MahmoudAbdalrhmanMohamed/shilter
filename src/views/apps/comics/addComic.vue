<template>
  <!-- Wrapper -->
  <div v-if="!loading" class="md:p-10">
    <!-- Form -->
    <VForm
      class="form w-full"
      id="add_comic_form"
      @submit="onSubmitComic"
      :validation-schema="comicSchema"
    >
      <!-- Heading -->
      <div class="text-center mb-10">
        <h1 class="text-gray-900 mb-3 text-xl md:text-3xl">
          {{ $t("addComic") }}
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

      <!-- Search for Artists -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900"
          >Search Artists</label
        >
        <input
          v-model="artistSearch"
          @input="onSearchArtists"
          class="form-control form-control-lg form-control-solid"
          placeholder="Type at least 3 characters to search"
        />
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

      <!-- Search for Genres -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900"
          >Search Genres</label
        >
        <input
          v-model="genreSearch"
          @input="onSearchGenres"
          class="form-control form-control-lg form-control-solid"
          placeholder="Type at least 3 characters to search"
        />
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

      <!-- Search for Publishers -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900"
          >Search Publishers</label
        >
        <input
          v-model="publisherSearch"
          @input="onSearchPublishers"
          class="form-control form-control-lg form-control-solid"
          placeholder="Type at least 3 characters to search"
        />
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

      <!-- Search for Writers -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900"
          >Search Writers</label
        >
        <input
          v-model="writerSearch"
          @input="onSearchWriters"
          class="form-control form-control-lg form-control-solid"
          placeholder="Type at least 3 characters to search"
        />
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

      <!-- Status (Single Select) -->
      <div class="fv-row mb-10">
        <label class="form-label fs-6 fw-bold text-gray-900">{{
          $t("status")
        }}</label>
        <Field name="status" v-slot="{ field }">
          <el-select
            v-model="formValues.status"
            v-bind="field"
            placeholder="Select Status"
            size="large"
            class="form-control-solid"
            tabindex="9"
            name="status"
          >
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
          <div class="fv-plugins-message-container">
            <div class="fv-help-block">
              <ErrorMessage name="status" />
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
          id="kt_add_comic_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label">{{ $t("addComic") }}</span>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Field, Form as VForm, ErrorMessage } from "vee-validate";
import * as Yup from "yup";
import { useI18n } from "vue-i18n";
import { useFetch } from "@vueuse/core";
import { debounce } from "lodash";

const { locale } = useI18n();

const loading = ref(false);
const router = useRouter();
const submitButton = ref(null);
const errorVal = ref(false);
const formValues = ref({
  imageFiles: [],
  artists: [],
  genres: [],
  description: "",
  publisher: "",
  writer: "",
  language: "",
  status: "", // Add status field
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

const statusOptions = [
  { label: "Ongoing", value: "ongoing" },
  { label: "Complete", value: "complete" },
];

const comicSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(4, "name must be at least 4 characters")
    .label("Name"),
  description: Yup.string()
    .max(500, "Description cannot exceed 500 characters")
    .min(50, "name must be at least 50 characters")
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
  status: Yup.string().required("Status is required").label("Status"), // Add status validation
});

// Search Variables
const publisherSearch = ref("");
const artistSearch = ref("");
const genreSearch = ref("");
const writerSearch = ref("");

// Debounced Search Handlers
const onSearchPublishers = debounce(async () => {
  if (publisherSearch.value.length >= 3) {
    await fetchingPublishers(publisherSearch.value);
  } else {
    publishers.value = [];
  }
}, 300);

const onSearchArtists = debounce(async () => {
  if (artistSearch.value.length >= 3) {
    await fetchingArtists(artistSearch.value);
  } else {
    artists.value = [];
  }
}, 300);

const onSearchGenres = debounce(async () => {
  if (genreSearch.value.length >= 3) {
    await fetchingGenres(genreSearch.value);
  } else {
    genres.value = [];
  }
}, 300);

const onSearchWriters = debounce(async () => {
  if (writerSearch.value.length >= 3) {
    await fetchingWriters(writerSearch.value);
  } else {
    writers.value = [];
  }
}, 300);

// Fetching Functions
const fetchingPublishers = async (search = "") => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/publishers?search=${search}`,
      {
        method: "GET",
        headers: {
          "X-Localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();
    publishers.value = [...data.data.data];
  } catch (error) {
    console.error("Error fetching publishers:", error);
  } finally {
    loading.value = false;
  }
};

const fetchingArtists = async (search = "") => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/artists?search=${search}`,
      {
        method: "GET",
        headers: {
          "X-Localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    artists.value = [...data.value.data.data];
  } catch (error) {
    console.error("Error fetching artists:", error);
  } finally {
    loading.value = false;
  }
};

const fetchingGenres = async (search = "") => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/genres?search=${search}`,
      {
        method: "GET",
        headers: {
          "X-Localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    const data = await response.json();
    genres.value = [...data.data.data];
  } catch (error) {
    console.error("Error fetching genres:", error);
  } finally {
    loading.value = false;
  }
};

const fetchingWriters = async (search = "") => {
  try {
    const { data } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/writers?search=${search}`,
      {
        method: "GET",
        headers: {
          "X-Localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    ).json();
    writers.value = [...data.value.data.data];
  } catch (error) {
    console.error("Error fetching writers:", error);
  } finally {
    loading.value = false;
  }
};

// Image Handlers
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

// Submit Handler
const onSubmitComic = async (values) => {
  if (submitButton.value) {
    submitButton.value.disabled = true;
    submitButton.value.setAttribute("data-kt-indicator", "on");
  }

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("year", values.year);
    formData.append("language_code", values.language);
    formData.append("status", values.status); // Add status to FormData

    values.artists.forEach((artist) => formData.append("artists[]", artist));
    values.genres.forEach((genre) => formData.append("genres[]", genre));

    formData.append("publisher_id", values.publisher);
    formData.append("writer_id", values.writer);

    if (formValues.value.imageFiles.length > 0) {
      const file = formValues.value.imageFiles[0].raw;
      formData.append("image_file", file);
    } else {
      throw new Error("Image is required");
    }

    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/comics`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      },
    );

    const data = await response.json();

    if (response.ok && data?.status) {
      Swal.fire({
        text: data.message || "Comic successfully added!",
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
      throw new Error(data?.message || "Failed to add comic.");
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
</script>
