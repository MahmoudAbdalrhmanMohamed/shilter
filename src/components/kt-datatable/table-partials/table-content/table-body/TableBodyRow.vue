<template>
  <tbody class="fw-semibold text-gray-600">
    <template v-for="(row, i) in data" :key="i">
      <tr>
        <td v-if="checkboxEnabled">
          <div
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="row[checkboxLabel]"
              v-model="selectedItems"
              @change="onChange"
            />
          </div>
        </td>
        <template v-for="(properties, j) in header" :key="j">
          <td
            :class="locale === 'ar' ? 'px-0' : ''"
            v-if="properties.columnLabel === 'image'"
          >
            <img
              alt="test"
              :src="row.image"
              class="rounded-full w-16 h-16 object-cover"
            />
          </td>
          <td
            v-else
            :class="[
              locale === 'ar' ? 'text-end px-0' : 'text-start',
              j === header.length - 1 ? 'text-end' : '',
            ]"
          >
            <slot :name="`${properties.columnLabel}`" :row="row">
              {{ row }}
            </slot>
          </td>
        </template>
      </tr>
    </template>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "table-body-row",
  components: {},
  props: {
    header: { type: Array as () => Array<any>, required: true },
    data: { type: Array as () => Array<any>, required: true },
    currentlySelectedItems: { type: Array, required: false, default: () => [] },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: {
      type: String as () => string,
      required: false,
      default: "id",
    },
  },
  emits: ["on-select"],
  setup(props, { emit }) {
    const selectedItems = ref<Array<any>>([]);
    const { locale } = useI18n();
    watch(
      () => [...props.currentlySelectedItems],
      (currentValue) => {
        if (props.currentlySelectedItems.length !== 0) {
          selectedItems.value = [
            ...new Set([...selectedItems.value, ...currentValue]),
          ];
        } else {
          selectedItems.value = [];
        }
      },
    );

    const onChange = () => {
      emit("on-select", selectedItems.value);
    };

    return {
      selectedItems,
      onChange,
      locale,
    };
  },
});
</script>
