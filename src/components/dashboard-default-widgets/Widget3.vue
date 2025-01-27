<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Info-->
        <div class="d-flex align-items-center">
          <!--begin::Currency-->
          <span class="fs-4 fw-semibold text-gray-500 me-1 align-self-start"
            >$</span
          >
          <!--end::Currency-->

          <!--begin::Amount-->
          <span class="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{{
            data
          }}</span>
          <!--end::Amount-->

          <!--begin::Badge-->
          <!-- <span class="badge badge-light-success fs-base">
            <KTIcon icon-name="arrow-up" icon-class="fs-5 text-success ms-n1" />
            2.2%
          </span> -->
          <!--end::Badge-->
        </div>
        <!--end::Info-->

        <!--begin::Subtitle-->
        <span class="text-gray-500 pt-1 fw-semibold fs-6"
          >Project Earnings</span
        >
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body pt-2 pb-4 d-flex flex-wrap align-items-center">
      <!--begin::Chart-->
      <div class="d-flex flex-center me-5 pt-2">
        <div
          id="kt_card_widget_17_chart"
          :style="{
            minWidth: `${chartSize}px`,
            minHeight: `${chartSize}px`,
          }"
          :data-kt-size="chartSize"
          :data-kt-line="11"
        ></div>
      </div>
      <!--end::Chart-->

      <!--begin::Labels-->
      <div class="d-flex flex-column content-justify-center flex-row-fluid">
        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center">
          <!--begin::Bullet-->
          <div class="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 flex-grow-1 me-4">{{ $t("users") }}</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end">${{ data }}</div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->

        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center my-3">
          <!--begin::Bullet-->
          <div class="bullet w-8px h-3px rounded-2 bg-primary me-3"></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 flex-grow-1 me-4">
            {{ $t("workshops") }}
          </div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end">${{ data }}</div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->

        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center">
          <!--begin::Bullet-->
          <div
            class="bullet w-8px h-3px rounded-2 me-3"
            style="background-color: #e4e6ef"
          ></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 flex-grow-1 me-4">Others</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end">${{ data }}</div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->
      </div>
      <!--end::Labels-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { getAssetPath } from "@/core/helpers/assets";
import { getCSSVariableValue } from "@/assets/ts/_utils";

// Props
defineProps({
  className: { type: String, required: false },
  data: { required: false },
  chartSize: { type: Number, required: true },
});

// Function to initialize the chart
const initChart = () => {
  const el = document.getElementById("kt_card_widget_17_chart");

  if (!el) return;

  const options = {
    size: el.getAttribute("data-kt-size")
      ? parseInt(el.getAttribute("data-kt-size"))
      : 70,
    lineWidth: el.getAttribute("data-kt-line")
      ? parseInt(el.getAttribute("data-kt-line"))
      : 11,
    rotate: el.getAttribute("data-kt-rotate")
      ? parseInt(el.getAttribute("data-kt-rotate"))
      : 145,
  };

  const canvas = document.createElement("canvas");
  const span = document.createElement("span");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.height = options.size;

  el.appendChild(span);
  el.appendChild(canvas);

  ctx.translate(options.size / 2, options.size / 2); // Center canvas
  ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // Rotate -90 degrees

  const radius = (options.size - options.lineWidth) / 2;

  const drawCircle = (color, lineWidth, percent) => {
    percent = Math.min(Math.max(0, percent || 1), 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = "round"; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Draw the chart
  drawCircle("#E4E6EF", options.lineWidth, 100 / 100);
  drawCircle(getCSSVariableValue("--bs-primary"), options.lineWidth, 100 / 150);
  drawCircle(getCSSVariableValue("--bs-success"), options.lineWidth, 100 / 250);
};

// Lifecycle hook
onMounted(() => {
  initChart();
});
</script>
