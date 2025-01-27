<template>
  <div
    class="modal fade"
    id="kt_modal_add_workshop"
    ref="addCustomerModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">{{ $t("addWorkshop") }}</h2>
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

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">address</label>
                <el-form-item prop="address">
                  <el-input
                    v-model="formData.address"
                    type="text"
                    placeholder="address"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">phone</label>
                <el-form-item prop="phone">
                  <el-input
                    v-model.number="formData.phone"
                    type="tel"
                    placeholder="phone"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">rating</label>
                <el-form-item prop="rating">
                  <el-input
                    v-model.number="formData.rating"
                    type="number"
                    min="1"
                    max="5"
                    placeholder="rating (1-5)"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">services</label>
                <el-form-item prop="services">
                  <el-input
                    v-model="formData.services"
                    type="text"
                    placeholder="services"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2"
                  >description</label
                >
                <el-form-item prop="description">
                  <el-input
                    v-model="formData.description"
                    type="text"
                    placeholder="description"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">visits</label>
                <el-form-item prop="visits">
                  <el-input
                    v-model.number="formData.visits"
                    type="number"
                    placeholder="visits"
                  />
                </el-form-item>
              </div>

              <div id="kt_docs_repeater_nested">
                <div
                  v-for="(model, modelIndex) in formData.models"
                  :key="modelIndex"
                  class="form-group grid gap-2 md:grid-cols-2 my-4 h-fit"
                >
                  <div class="w-full">
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

                  <div class="w-full">
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

                  <div class="col-span-2 justify-self-end">
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
                  class="btn btn-flex btn-light-primary mt-5 w-fit mb-2"
                  @click="addModel"
                  type="button"
                >
                  <KTIcon icon-name="plus" icon-class="fs-3" />{{
                    $t("addModel")
                  }}
                </button>
              </div>

              <div id="kt_docs_repeater_nested">
                <div
                  v-for="(socialMedia, index) in formData.socialMedias"
                  :key="index"
                  class="form-group grid gap-2 md:grid-cols-2 my-4 h-fit"
                >
                  <div class="w-full">
                    <label class="required fs-6 fw-semibold mb-2">{{
                      $t("platform")
                    }}</label>
                    <el-form-item :prop="`socialMedias.${index}.platform`">
                      <el-input
                        v-model="socialMedia.platform"
                        type="text"
                        placeholder="Platform (e.g., Instagram)"
                      />
                    </el-form-item>
                  </div>

                  <div class="w-full">
                    <label class="required fs-6 fw-semibold mb-2">{{
                      $t("url")
                    }}</label>
                    <el-form-item :prop="`socialMedias.${index}.url`">
                      <el-input
                        v-model="socialMedia.url"
                        type="text"
                        placeholder="Platform URL"
                      />
                    </el-form-item>
                  </div>

                  <div class="col-span-2 justify-self-end">
                    <button
                      class="btn btn-sm btn-light-danger"
                      @click="removeSocialMedia(index)"
                      type="button"
                    >
                      <KTIcon icon-name="trash" icon-class="fs-5" /> Delete
                      Platform
                    </button>
                  </div>
                </div>

                <button
                  class="btn btn-flex btn-light-primary mt-5 w-fit mb-2"
                  @click="addSocialMedia"
                  type="button"
                >
                  <KTIcon icon-name="plus" icon-class="fs-3" />
                  {{ $t("addPlatform") }}
                </button>
              </div>

              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("daysPerWeek")
                }}</label>
                <el-form-item prop="daysPerWeek">
                  <div class="flex flex-wrap gap-2">
                    <el-checkbox-group v-model="formData.daysPerWeek">
                      <el-checkbox
                        v-for="option in options"
                        :key="option.value"
                        :value="option.value"
                        class="mx-2"
                      >
                        {{ option.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("openingTimeCloseTime")
                }}</label>
                <el-form-item prop="opening_CloseTime">
                  <el-time-picker
                    v-model="formData.opening_CloseTime"
                    is-range
                    range-separator="To"
                    start-placeholder="Opening time"
                    end-placeholder="Close time"
                  />
                </el-form-item>
              </div>
              <div class="fv-row mb-7">
                <label class="required fs-6 fw-semibold mb-2">{{
                  $t("uploadPhoto")
                }}</label>
                <el-form-item prop="files">
                  <el-upload
                    v-model:file-list="formData.files"
                    class="upload-demo"
                    :limit="1"
                    :auto-upload="false"
                    list-type="picture-card"
                  >
                    <el-button type="primary">{{
                      $t("uploadPhoto")
                    }}</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        {{ $t("messageError") }}
                      </div>
                    </template>
                  </el-upload>
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
                $t("addWorkshop")
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

const emit = defineEmits(["data"]);

const loading = ref(false);
const formRef = ref(null);
const formData = ref({
  nameAr: "",
  nameEn: "",
  address: "",
  phone: "",
  description: "",
  rating: "",
  services: "",
  visits: "",
  models: [{ nameAr: "", nameEn: "" }],
  opening_CloseTime: "",
  socialMedias: [{ platform: "", url: "" }],
  daysPerWeek: [],
  files: [],
});

const rules = {
  nameAr: [
    {
      required: true,
      message: "Workshop name in Arabic is required",
      trigger: "blur",
    },
  ],
  nameEn: [
    {
      required: true,
      message: "Workshop name in English is required",
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: "address is required",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "phone is required",
      trigger: "blur",
    },
  ],
  description: [
    {
      required: true,
      message: "description is required",
      trigger: "blur",
    },
  ],
  rating: [
    {
      required: true,
      message: "rating is required",
      trigger: "blur",
    },
    {
      type: "number",
      min: 1,
      max: 5,
      message: "rating must be between 1 and 5",
      trigger: "blur",
    },
  ],
  services: [
    {
      required: true,
      message: "services is required",
      trigger: "blur",
    },
  ],
  visits: [
    {
      required: true,
      message: "visits is required",
      trigger: "blur",
    },
    {
      type: "number",
      message: "visits must be a valid number",
      trigger: "blur",
    },
  ],
  models: [
    {
      required: true,
      message: "models is required",
      trigger: "blur",
    },
  ],
  socialMedias: [
    {
      required: true,
      message: "Social media URL is required",
      trigger: "blur",
    },
  ],
  daysPerWeek: [
    {
      required: true,
      type: "array",
      message: "At least one working day must be selected",
      trigger: "change",
    },
  ],
  opening_CloseTime: [
    {
      required: true,
      message: "Opening and closing times are required",
      trigger: "blur",
    },
  ],
};

const resetForm = () => {
  formData.value = {
    nameAr: "",
    nameEn: "",
    address: "",
    phone: "",
    description: "",
    rating: "",
    services: "",
    visits: "",
    models: [],
    socialMedias: [
      { platform: "instagram", url: "" },
      { platform: "facebook", url: "" },
      { platform: "whatsapp", url: "" },
      { platform: "telegram", url: "" },
    ],
    daysPerWeek: [],
    opening_CloseTime: "",
    files: [],
  };
  formRef.value.resetFields();
};

const submit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;

      console.log(formData.value);

      emit("data", formData.value);
      setTimeout(() => {
        loading.value = false;
        Swal.fire("Form submitted successfully!", "", "success");
        resetForm();
      }, 1500);
    }
  });
};

const options = ref([
  { label: "السبت", value: "السبت" },
  { label: "الاحد", value: "الاحد" },
  { label: "الاثنين", value: "الاثنين" },
  { label: "الثلاثاء", value: "الثلاثاء" },
  { label: "الاربعاء", value: "الاربعاء" },
  { label: "الخميس", value: "الخميس" },
  { label: "الجمعة", value: "الجمعة" },
]);

const addSocialMedia = () => {
  formData.value.socialMedias.push({ platform: "", url: "" });
};

const removeSocialMedia = (index) => {
  formData.value.socialMedias.splice(index, 1);
};

const addModel = () => {
  formData.value.models.push({ nameAr: "", nameEn: "" });
};

const removeModel = (index) => {
  formData.value.models.splice(index, 1);
};
</script>
