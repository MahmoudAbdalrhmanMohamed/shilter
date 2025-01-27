const brands = [
  {
    id: Math.floor(Math.random() * 99999) + 1,
    name: "Emma Smith",
    models: [
      {
        id: 1,
        years: [
          { value: 2017, id: 1 },
          { value: 2030, id: 2 },
        ],
        name: "Model Name",
      },
      {
        id: 2,
        years: [
          { value: 2017, id: 1 },
          { value: 2030, id: 2 },
        ],
        name: "Model Name 2",
      },
      {
        id: 3,
        years: [
          { value: 2017, id: 1 },
          { value: 2030, id: 2 },
        ],
        name: "Model Name 3",
      },
    ],
  },
];

export default brands;

// import { useFetch } from "@vueuse/core/index.cjs";
// import { ref } from "vue";

// const brands = ref([]);

// const getData = async (locale) => {
//   const { data, error } = await useFetch(
//     `${import.meta.env.VITE_APP_API_URL_MEGATRON}/brands`,
//     {
//       headers: {
//         "X-localization": locale.value,
//       },
//     },
//   ).json();
//   const { data: dataModels, errorModels } = await useFetch(
//     `${import.meta.env.VITE_APP_API_URL_MEGATRON}/models`,
//     {
//       headers: {
//         "X-localization": locale.value,
//       },
//     },
//   ).json();
//   const { data: dataYears, errorYears } = await useFetch(
//     `${import.meta.env.VITE_APP_API_URL_MEGATRON}/years`,
//     {
//       headers: {
//         "X-localization": locale.value,
//       },
//     },
//   ).json();

//   if (
//     !error.value &&
//     data.value &&
//     !errorModels.value &&
//     dataModels.value &&
//     !errorYears.value &&
//     dataYears.value
//   ) {
//     brands.value = data.value.data;
//   } else {
//     console.error("Failed to fetch brands");
//     brands.value = [];
//   }
// };

// export { brands, getData };
