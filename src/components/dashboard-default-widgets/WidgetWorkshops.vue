<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-900">
          {{ $t("Number Of Uploaded Comics By Day") }}
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
          {
            name: $t('Number Of Uploaded Comics By Day'),
            data: [...data.workshops],
          },
          // { name: 'users', data: [...data.users] },
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
import { getAssetPath } from "@/core/helpers/assets";

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

// Mounting chart options
onMounted(() => {
  Object.assign(chart.value, chartOptions(props.height, zoomLevel.value));
});

// Watch theme changes to update the chart
watch(themeMode, () => {
  refreshChart();
});

// Chart options generator
const chartOptions = (height, tickAmount) => {
  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-border-dashed-color");
  const baseprimaryColor = getCSSVariableValue("--bs-primary");
  const lightprimaryColor = getCSSVariableValue("--bs-primary");
  const basesuccessColor = getCSSVariableValue("--bs-success");
  const lightsuccessColor = getCSSVariableValue("--bs-success");

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
      colors: [baseprimaryColor, basesuccessColor],
    },
    xaxis: {
      categories: [
        "",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "",
      ],
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
      },
    },
    yaxis: {
      max: 120,
      min: 30,
      tickAmount: tickAmount, // Dynamic zoom for Y-axis
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    colors: [lightprimaryColor, lightsuccessColor],
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
