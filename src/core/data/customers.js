import { useFetch } from "@vueuse/core";
import { ref } from "vue";

const customers = ref([]);
const dataVal = ref();

const getData = async (locale, page) => {
  try {
    // Fetch data with proper headers
    const { data, error } = await useFetch(
      `${import.meta.env.VITE_APP_API_URL_MEGATRON}/services?page=${page}`,
      {
        headers: {
          "X-localization": locale.value,
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Fixed typo from authTocken to authToken
        },
      },
    ).json();

    // Check for errors and update the customers list
    if (!error.value && data.value) {
      customers.value = data.value.data.data;
      dataVal.value = data.value.data.meta.total;
    } else {
      console.error("Failed to fetch customers:", error.value);
      customers.value = [];
    }
  } catch (err) {
    console.error("An error occurred during fetch:", err);
    customers.value = [];
  }
};

export { customers, getData, dataVal };
