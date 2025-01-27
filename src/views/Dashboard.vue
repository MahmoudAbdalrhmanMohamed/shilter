<template>
  <div v-if="!loading && dataVal">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-10 mb-5 xl:mb-10">
      <!-- Card 2 -->
      <Widget11
        :usersCount="dataVal.homelesses_count"
        :usersVerifiedCount="dataVal.homelesses_approved"
        :description="$t('allHomelesses')"
        tanslated="approved"
        bgColor="#430f58"
        className="h-full"
      />
      <Widget1
        :usersCount="565"
        :usersVerifiedCount="dataVal.categories_count"
        :description="$t('allCategories')"
        bgColor="#F1416C"
        :bgImage="getAssetPath('media/patterns/vector-1.png')"
        className="h-full pb-24"
      />
    </div>
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <div class="w-full">
        <WidgetMoney
          :data="dataVal.homelesses"
          className="h-lg-100"
          :height="300"
        />
      </div>
    </div>

    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <div class="w-full">
        <Widget10
          v-if="dataVal.homelesses_list.length"
          :workshops="dataVal.homelesses_list"
          className="h-md-100"
        />
      </div>
    </div>
  </div>
  <div v-else class="w-full h-screen grid place-items-center">
    <span class="loader"></span>
  </div>
</template>

<script setup>
import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import Widget11 from "@/components/dashboard-default-widgets/Widget1Progress.vue";

import WidgetMoney from "@/components/dashboard-default-widgets/WidgetMoney.vue";
import Widget10 from "@/components/dashboard-default-widgets/Widget10.vue";
import Widget1010 from "@/components/dashboard-default-widgets/Widget1010.vue";
import { useFetch } from "@vueuse/core";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { getAssetPath } from "@/core/helpers/assets";

const router = useRouter();
const { locale } = useI18n();
const dataVal = ref(null);
const loading = ref(false);
const isFetching = ref(false); // Prevent concurrent API calls

const fetching = async () => {
  if (isFetching.value) return;

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No token found, redirecting to login.");
    router.replace({ name: "sign-in" }); // Redirect to login if token is missing
    return;
  }

  isFetching.value = true;

  try {
    loading.value = true;

    console.log(`${import.meta.env.VITE_APP_API_URL_NEW}/dashboard`);
    const response = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_NEW}/dashboard`,
      {
        method: "GET",
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${authToken}`,
        },
      },
    ).json();

    if (response?.data.value?.status) {
      dataVal.value = response.data.value.data;
    } else if (response?.data.value?.message === "Unauthenticated") {
      console.warn("Unauthenticated, clearing token and redirecting.");
      localStorage.removeItem("authToken");
      router.replace({ name: "sign-in" });
    } else {
      throw new Error(response?.data.value?.message);
    }
  } catch (error) {
    console.error("Error:", error.message);
    // localStorage.removeItem("authToken");
    // router.replace({ name: "sign-in" });
  } finally {
    loading.value = false;
    isFetching.value = false;
  }
};

// Initial fetch
fetching();

// Watch locale and refetch only when necessary
watch(
  () => locale.value,
  async () => {
    await fetching();
  },
);

// dataVal.value = {
//   workshopsCount: 21,
//   usersCount: 64,
//   usersVerifiedCount: 39,
//   totalEarning: 0,
//   transactions: [],
//   workshops: [
//     {
//       id: 21,
//       image:
//         "https://yasta.megatron-soft.com/app/workshops/ERPLSjdtai1q3wQAZvt8Tmg5L5UYG36m5JFBNo2k.jpg",
//       name: "تستر2",
//       address: "اي حاجه",
//       latitude: "29.899446641464646",
//       longitude: "31.279072612524033",
//       phone: "01599668800",
//       description: "01599668800",
//       images: [
//         {
//           id: 74,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/vn7FOoMFmupJMINRzbBQE3lkPZ2ncEDgBFN3CqFW.jpg",
//         },
//         {
//           id: 75,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/MH5uEyLWWoHb6DBL3Y31ilc4BaZk0VApmhYCbsY9.jpg",
//         },
//       ],
//     },
//     {
//       id: 20,
//       image:
//         "https://yasta.megatron-soft.com/app/workshops/nfG0xX2GOry4yWRzmrBzBQUA9kdKFW7IeENVr6fS.jpg",
//       name: "testtt",
//       address: "hena",
//       latitude: "29.95939578587414",
//       longitude: "31.248742863535877",
//       phone: "0123",
//       description: "gsgsh",
//       images: [
//         {
//           id: 68,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/3FNP62WQrq8Aj8IVWENeVCLnL1jLoOadpWSGHevE.jpg",
//         },
//         {
//           id: 69,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/wqIFralQZBenSyBIJFhqmEAUkDaSvToU7RDeld3P.jpg",
//         },
//         {
//           id: 70,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/vyP3lMW2zDXdFjCu4VI3ZvU7plaChqOUCRkKZeb3.jpg",
//         },
//         {
//           id: 71,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/gQAM2KTi7CloNQ61VsMgV35WP73IilIO6qdP93E1.jpg",
//         },
//         {
//           id: 72,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/uWrpsjsnyK6FJtOiYsyxFbhS8ECLWsP4exas9SDN.jpg",
//         },
//         {
//           id: 73,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/qnzgMw5tFnhOh98MU5kXcpXR47GKxgk0rx1lxaWJ.jpg",
//         },
//       ],
//     },
//     {
//       id: 19,
//       image:
//         "https://yasta.megatron-soft.com/app/workshops/QOHruKrTvYdbJtoj77JaGZ4pLBs7pndVhlOZZbWx.jpg",
//       name: "testtt",
//       address: "hena",
//       latitude: "29.95939578587414",
//       longitude: "31.248742863535877",
//       phone: "001",
//       description: "gsgsh",
//       images: [
//         {
//           id: 66,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/PWA6j0GKp2FQMcAoxatT05zSo75vFp8ICXkQ0WUi.jpg",
//         },
//         {
//           id: 67,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/PbdFJIm1B3KQ9PA2TQZ9LkJSn4IRinxeZkiFjOVo.jpg",
//         },
//       ],
//     },
//     {
//       id: 18,
//       image:
//         "https://yasta.megatron-soft.com/app/workshops/RLUOr1VyTVaSNTfSooQj1OrZR5xJwQGAqCfztLEo.jpg",
//       name: "ورشه السيارات",
//       address: "دار السلام",
//       latitude: "29.982646860926735",
//       longitude: "31.23046461492777",
//       phone: "01020000177",
//       description: "مكان حلو",
//       images: [
//         {
//           id: 57,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/rIxXSSrmjeqwPwHiZnFj5mbxOa8risss1cEZthIq.jpg",
//         },
//       ],
//     },
//     {
//       id: 17,
//       image:
//         "https://yasta.megatron-soft.com/app/workshops/NJ4n1uRV656TJF9S3EdXlq4z5ICbM5sV8wOt0ZBf.jpg",
//       name: "اي حاجه لحد من شوف هنسميها اي",
//       address: "اي حاجه",
//       latitude: "29.466846176287607",
//       longitude: "31.27589151263237",
//       phone: "01155880077",
//       description: "اي حاجه",
//       images: [
//         {
//           id: 54,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/fb0A06DHuZemHAeRvLUPnnn4fKtiAbHIYmh5BGRf.jpg",
//         },
//         {
//           id: 55,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/eeQzGT4ebw1gpJbnnFRndZi2BgP6PubcnBjnNYMs.jpg",
//         },
//         {
//           id: 56,
//           image:
//             "https://yasta.megatron-soft.com/app/workshops/nClSxQZL3yJPUPat2W3GU2ebE5XCZQUBorxmzMAY.jpg",
//         },
//       ],
//     },
//   ],
//   charts: {
//     workshops: [
//       65, 80, 80, 60, 60, 45, 45, 80, 80, 70, 70, 90, 90, 80, 80, 80, 60, 60,
//       50,
//     ],
//     earning: [
//       90, 110, 110, 95, 95, 85, 85, 95, 95, 115, 115, 100, 100, 115, 115, 95,
//       95, 85, 85,
//     ],
//     users: [115, 115, 100, 100, 115, 115, 95, 95, 85, 85],
//   },
// };
</script>
