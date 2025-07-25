<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-900">
          {{ $t("requestHomelesses") }}
        </span>
      </h3>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body d-flex align-items-end p-0">
      <!--begin::Chart-->
      <apexchart
        class="min-h-auto w-100 ps-4 pe-6"
        ref="chartRef"
        :options="chart"
        :series="[
          { name: $t('numberOfHomelesses'), data: [...data] },
          // { name: $t('Number Of Approved'), data: [...data.workshops] },
          // { name: $t('Number Of Rejected'), data: [...data.users] },
        ]"
        :height="height"
      ></apexchart>
      <!--end::Chart-->
    </div>

    <!-- Zoom Buttons -->
    <div class="zoom-controls">
      <button @click="zoomIn" class="btn btn-primary">
        {{ $t("zoomIn") }}
      </button>
      <button @click="zoomOut" class="btn btn-secondary">
        {{ $t("zoomOut") }}
      </button>
    </div>
    <!--end::Card body-->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import { useThemeStore } from "@/stores/theme";
import { useI18n } from "vue-i18n";

// Props
const props = defineProps({
  className: { type: String, required: false },
  data: { required: false },
  height: { type: Number, required: true },
});

// Refs and reactive data
const chartRef = ref(null);
const chart = ref({});

const themeStore = useThemeStore();
const themeMode = computed(() => themeStore.mode);

// Detect RTL or LTR direction
const isRTL = computed(() => document.documentElement.dir === "rtl");

// Zoom functionality
let zoomLevel = ref(6);

const zoomIn = () => {
  if (zoomLevel.value > 1) {
    zoomLevel.value -= 1;
    refreshChart();
  }
};

const zoomOut = () => {
  if (zoomLevel.value < 10) {
    zoomLevel.value += 1;
    refreshChart();
  }
};

const refreshChart = () => {
  if (chartRef.value) {
    chartRef.value.updateOptions(chartOptions(props.height, zoomLevel.value));
  }
};

// Function to generate days of the current month up to the current day
const generateDaysOfMonth = () => {
  const today = new Date();
  const currentDay = today.getDate();
  const days = [];
  for (let i = 1; i <= currentDay; i++) {
    days.push(i.toString());
  }
  return days;
};

// Mounting chart options
onMounted(() => {
  Object.assign(chart.value, chartOptions(props.height, zoomLevel.value));
});

// Watch theme changes to update the chart
watch(themeMode, () => {
  refreshChart();
});

// Watch RTL/LTR changes to update the chart
watch(isRTL, () => {
  refreshChart();
});

const { locale } = useI18n();

// Chart options generator
const chartOptions = (height, tickAmount) => {
  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-border-dashed-color");

  // Define colors for series
  const pendingColor = "#007BFF"; // Blue
  const approvedColor = "#28A745"; // Green
  const rejectedColor = "#FF0000"; // Red

  return {
    chart: {
      fontFamily: "inherit",
      type: "area",
      height: height,
      toolbar: {
        show: true, // Enable zoom and pan controls
      },
      zoom: {
        enabled: true,
      },
      rtl: isRTL.value, // Enable RTL mode dynamically
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.2,
        stops: [15, 120, 100],
      },
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [pendingColor, approvedColor, rejectedColor], // Assign colors to series
    },
    xaxis: {
      categories: generateDaysOfMonth(), // Generate days of the current month up to today
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tickAmount: tickAmount, // Dynamic zoom based on tickAmount
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
        offsetX: 10, // Add padding to the left and right of x-axis labels
        offsetY: 5, // Add padding above and below x-axis labels
      },
    },
    yaxis: {
      tickAmount: tickAmount, // Dynamic zoom for Y-axis
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
        offsetX: locale.value === "en" ? 5 : -10, // Add padding to the left and right of y-axis labels
      },
    },
    colors: [pendingColor, approvedColor, rejectedColor], // Color configuration for area fill
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
    },
    markers: {
      strokeWidth: 3,
    },
  };
};
</script>

<style scoped>
.zoom-controls {
  display: flex;
  justify-content: flex-end;
  margin: 10px;
}
.zoom-controls button {
  margin-left: 10px;
}
</style>
