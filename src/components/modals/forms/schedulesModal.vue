<template>
  <div
    class="modal fade"
    id="kt_modal_update_schedule"
    ref="scheduleModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="fw-bold font-bold">{{ $t("updateSchedule") }}</h2>
          <button
            id="kt_modal_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
            aria-label="Close Modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </button>
        </div>

        <!-- Modal Body -->
        <el-form
          @submit.prevent="submit"
          :model="formData"
          :rules="rules"
          ref="formRef"
        >
          <div class="modal-body py-10 px-lg-17">
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_schedule_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_update_user_header"
              data-kt-scroll-wrappers="#kt_modal_update_user_scroll"
              data-kt-scroll-offset="300px"
            >
              <!-- Days of the Week -->
              <h4 class="fw-semibold mb-5">{{ $t("workingDays") }}</h4>
              <el-form-item prop="day_week">
                <el-radio-group v-model="formData.day_week">
                  <el-radio
                    v-for="day in daysOfWeek"
                    :key="day.value"
                    :value="day.value"
                  >
                    {{ day.value }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- Opening and Closing Times -->
              <h4 class="fw-semibold mb-5">{{ $t("workingHours") }}</h4>
              <el-form-item prop="openingCloseTime">
                <el-time-picker
                  v-model="formData.openingCloseTime"
                  is-range
                  range-separator="To"
                  start-placeholder="Opening Time"
                  end-placeholder="Closing Time"
                  class="w-100"
                />
              </el-form-item>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer flex-center">
            <button
              type="button"
              class="btn btn-light me-3"
              @click="resetForm"
              aria-label="Discard Changes"
            >
              {{ $t("discard") }}
            </button>
            <button
              :data-kt-indicator="loading ? 'on' : null"
              class="btn btn-lg btn-primary d-flex items-center"
              type="submit"
            >
              <span v-if="!loading">{{ $t("updateSchedule") }}</span>
              <span v-if="loading" class="indicator-progress">
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
import { hideModal } from "../../../core/helpers/modal.ts";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const props = defineProps({
  currentUser: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["updateData"]);

const formRef = ref(null);
const loading = ref(false);

const formData = ref({
  day_week: "", // Single value instead of an array
  openingCloseTime: [],
});

const daysOfWeek = [
  { label: locale === "ar" ? "السبت" : "saturday", value: "saturday" },
  { label: locale === "ar" ? "الاحد" : "sunday", value: "sunday" },
  { label: locale === "ar" ? "الاثنين" : "monday", value: "monday" },
  { label: locale === "ar" ? "الثلاثاء" : "tuesday", value: "tuesday" },
  { label: locale === "ar" ? "الأربعاء" : "wednesday", value: "wednesday" },
  { label: locale === "ar" ? "الخميس" : "thursday", value: "thursday" },
  { label: locale === "ar" ? "الجمعة" : "friday", value: "friday" },
];

const rules = {
  day_week: [
    {
      required: true,
      message: "Please select a day",
      trigger: "blur",
    },
  ],
  openingCloseTime: [
    {
      required: true,
      type: "array",
      message: "Opening and closing times are required",
      trigger: "blur",
    },
  ],
};

// Watch for prop changes
watch(
  () => props.currentUser,
  (newUser) => {
    if (newUser) {
      formData.value.day_week = newUser.day_week;

      const today = new Date();
      const parseTime = (time) => {
        const [hours, minutes, seconds] = time.split(":");
        return new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes,
          seconds,
        );
      };

      formData.value.openingCloseTime = [
        parseTime(newUser.opening_time),
        parseTime(newUser.closing_time),
      ];
    }
  },
);

const resetForm = () => {
  formRef.value.resetFields();
};

const submit = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;

      const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      const updatedData = ref({
        // id: props.currentUser.id,
        day_week: formData.value.day_week,
        opening_time: formatTime(formData.value.openingCloseTime[0]),
        closing_time: formatTime(formData.value.openingCloseTime[1]),
      });

      try {
        console.log(props.currentUser.id);

        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL_MEGATRON}/workshop/schedules/${props.currentUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(updatedData.value),
          },
        );

        const data = await response.json();

        if (response.ok && data.status) {
          emit("updateData", updatedData);
          Swal.fire("Schedule updated successfully!", "", "success");
          resetForm();
          hideModal("#kt_modal_update_schedule");
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        Swal.fire({ icon: "error", text: error.data.message });
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>
