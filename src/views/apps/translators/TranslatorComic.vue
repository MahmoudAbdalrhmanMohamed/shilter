<template>
  <!--begin::Layout-->
  <div class="flex flex-col">
    <!--begin::Sidebar-->
    <div v-if="dataToShow" class="flex-column flex-lg-row-auto w-full mb-10">
      <!--begin::Card-->
      <div class="card mb-5 mb-xl-8">
        <!--begin::Card body-->
        <div class="card-body pt-15">
          <!--begin::Summary-->
          <div class="d-flex flex-center flex-column mb-5">
            <!--begin::Avatar-->
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img :src="dataToShow.image" alt="image" class="object-cover" />
            </div>
            <!--end::Avatar-->

            <!--begin::Name-->
            <a
              href="#"
              class="fs-3 text-gray-800 text-hover-primary fw-bold mb-1"
            >
              {{ dataToShow.name }}
            </a>
            <!--end::Name-->
          </div>
          <!--end::Summary-->

          <!--begin::Details toggle-->
          <div class="d-flex flex-stack fs-4 py-3">
            <div class="fw-bold rotate collapsible" role="button">
              {{ $t("details") }}
              <span class="ms-2 rotate-180">
                <KTIcon icon-name="down" icon-class="fs-3" />
              </span>
            </div>
          </div>
          <!--end::Details toggle-->

          <!--begin::Details content-->
          <div id="kt_translator_view_details" class="show">
            <div class="badge badge-light-info d-inline">
              {{ dataToShow.type }} {{ $t("translator") }}
            </div>
            <div class="py-5 fs-6">
              <!-- Language -->
              <div class="fw-bold mt-5">{{ $t("language") }}</div>
              <div class="text-gray-600">{{ dataToShow.language_code }}</div>

              <!-- Followers Count -->
              <div class="fw-bold mt-5">{{ $t("followersCount") }}</div>
              <div class="text-gray-600">{{ dataToShow.followers_count }}</div>

              <!-- Translation Rate -->
              <div class="fw-bold mt-5">{{ $t("translationRate") }}</div>
              <div class="text-gray-600">
                <Stars :value="Number(dataToShow.rate_tranlation)" />
              </div>

              <!-- Clarity Rate -->
              <div class="fw-bold mt-5">{{ $t("clarityRate") }}</div>
              <div class="text-gray-600">
                <Stars :value="Number(dataToShow.rate_clarity)" />
              </div>

              <!-- Experience Type -->
              <div class="fw-bold mt-5">{{ $t("experienceType") }}</div>
              <div
                class="badge-success w-fit px-3 py-2 text-white my-1 capitalize rounded-md"
              >
                {{ dataToShow.experience_type }}
              </div>

              <!-- Description -->
              <div class="fw-bold mt-5">{{ $t("description") }}</div>
              <div class="text-gray-600">{{ dataToShow.descripion }}</div>

              <div class="flex items-center w-full mt-5">
                <button
                  class="btn btn-accept me-2 w-full"
                  @click="acceptRequest(route.params.Translator)"
                >
                  <i class="fas fa-check-circle me-2 pulse-icon"></i>
                  {{ $t("accept") }}
                </button>
                <button
                  class="btn btn-reject w-full"
                  @click="rejectRequest(route.params.Translator)"
                >
                  <i class="fas fa-times-circle me-2 pulse-icon"></i>
                  {{ $t("reject") }}
                </button>
              </div>
            </div>
          </div>
          <!--end::Details content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>

    <!--begin::Main Content-->
    <div v-else class="w-full h-screen grid place-items-center">
      <span class="loader"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Stars from "@/components/StarsWithoutText.vue";

const { t, locale } = useI18n();
const route = useRoute();

// Reactive state
const dataToShow = ref(null);
const loading = ref(true);

// Fetch translator data
const fetchTranslatorData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/translators/${route.params.Translator}`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch translator data");
    }

    const data = await response.json();

    if (data.status) {
      dataToShow.value = data.data;
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Error fetching translator data:", error);
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount

fetchTranslatorData();
</script>
<style scoped>
/* Base button styles */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Gradient animation */
.btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%
  );
  background-size: 200% 200%;
  transition: background-position 0.5s ease;
  z-index: 1;
  border-radius: 12px;
}

.btn:hover::before {
  background-position: -100% -100%;
}

/* Accept button */
.btn-accept {
  background: linear-gradient(135deg, #4caf50, #81c784);
  color: white;
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
  position: relative;
  z-index: 2;
}

.btn-accept:hover {
  background: linear-gradient(135deg, #81c784, #4caf50);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
  transform: translateY(-2px);
}

.btn-accept:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
}

/* Reject button */
.btn-reject {
  background: linear-gradient(135deg, #f44336, #e57373);
  color: white;
  box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
  position: relative;
  z-index: 2;
}

.btn-reject:hover {
  background: linear-gradient(135deg, #e57373, #f44336);
  box-shadow: 0 6px 12px rgba(244, 67, 54, 0.3);
  transform: translateY(-2px);
}

.btn-reject:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(244, 67, 54, 0.2);
}

/* Icon styles */
.btn i {
  font-size: 16px;
  transition:
    transform 0.3s ease,
    color 0.3s ease;
  color: white; /* Set icon color to white */
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5); /* Add a subtle glow */
}

/* Icon animation on hover */
.btn:hover i {
  transform: scale(1.2);
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8); /* Increase glow on hover */
}

/* Pulse animation for icons */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pulse-icon {
  animation: pulse 1.5s infinite;
}
</style>
