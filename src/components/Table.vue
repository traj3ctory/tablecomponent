<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
ColumnI,
DataI,
EditionI,
FeatureI,
ScreenshotI,
ValidSortKey,
} from "../types";
import { formattedEditions, formattedTimeOfCapture } from "../utils/formatters";
// import jsonData from "./data.json";

const data = ref<DataI[]>([]);
const sortDirection = ref<string>("asc");
const sortKey = ref<string>("");
const filterValue = ref<string>("");
const loading = ref<boolean>(true);
const title = ref<string>("");
let lastClickedColumn: ValidSortKey | null = null;

const columnHeaders = [
  { label: "Name", title: "name", sort: true },
  { label: "Description", title: "description", sort: true },
  { label: "Editions(s)", title: "FeatureEditions", sort: true },
  { label: "timeOfScreenshot", title: "screenshots", sort: true },
  // Add more columns as needed
] as ColumnI[];

const sortDirectionMap = new Map<
  keyof FeatureI | keyof EditionI | keyof ScreenshotI | string,
  "asc" | "desc"
>();

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await fetch(
      "https://content.launchbrightly.com/lbdemo/baremetrics.json"
    );
    const jsonData: DataI = await response.json();
    data.value = [jsonData as DataI]; // The JSON contains a single object, so we put it in an array for easier processing
    title.value = data.value[0].name;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
  }
};

const sort = (key: ValidSortKey) => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  sortKey.value = key;

  sortDirectionMap.set(
    key,
    sortDirectionMap.get(key) === "asc" ? "desc" : "asc"
  );
  lastClickedColumn = key;

  data.value[0].features.items.sort((a, b) => {
    const valueA = getValue(a, key);
    const valueB = getValue(b, key);

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection.value === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection.value === "asc"
      ? (valueA as any) - (valueB as any)
      : (valueB as any) - (valueA as any);
  });
};

const getValue = (
  item: FeatureI,
  key: keyof FeatureI | keyof EditionI | keyof ScreenshotI
) => {
  if (key === "FeatureEditions" && "FeatureEditions" in item) {
    return item.FeatureEditions.items
      .map((editionItem) => editionItem.edition.name)
      .join(", ");
  } else if (key === "screenshots" && "FeatureEditions" in item) {
    return item.screenshots.items
      .map((screenshotItem) => screenshotItem.timeOfCapture)
      .join(", ");
  } else if (key in item) {
    return item[key as keyof FeatureI];
  }

  return ""; // Default value if the key is not found in any nested objects
};

const filteredData = computed(() => {
  if (data?.value == undefined) {
    return [];
  }
  if (!filterValue.value) {
    return data.value;
  }

  const filterText = filterValue.value.toLowerCase();
  const foundEditions = data?.value[0].editions.items.filter(
    (edition) =>
      edition.name.toLowerCase().includes(filterText) ||
      edition.description.toLowerCase().includes(filterText)
  );
  //   get the ids which for foundEditions, put in an array find the uniques of those id

  const foundEditionsId = foundEditions.map((el) => el.id);

  const foundFeatures = data?.value[0].features.items.filter((item) => {
    return item.FeatureEditions.items.some((edition) =>
      foundEditionsId.includes(edition.edition.id)
    );
  });

  return [{ ...data.value[0], features: { items: foundFeatures } }];
});

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="p-4 shadow-xl h-[75vh] w-full">
    <div class="flex justify-between items-center w-full">
      <caption>
        {{
          title ?? ""
        }}
      </caption>
      <input
        v-model="filterValue"
        type="text"
        class="border rounded-md p-2 mb-4"
        placeholder="Filter by Edition"
      />
    </div>
    <div class="overflow-auto h-[60vh] border-b-4">
      <table class="table-auto w-full divide-y divide-gray-200">
        <thead class="text-left bg-gray-50">
          <tr>
            <!-- <th class="py-4" @click="sort('name')">
              Name&ensp;<span v-if="sortDirectionMap.get('name') === 'asc'"
                >&uarr;</span
              >
              <span v-else-if="sortDirectionMap.get('name') === 'desc'"
                >&darr;</span
              >
            </th>
            <th class="py-4" @click="sort('description')">Description</th>
            <th class="py-4" @click="sort('FeatureEditions')">Editions(s)</th>
            <th class="py-4" @click="sort('screenshots')">timeOfScreenshot</th> -->
            <th
              class="py-4 border-x px-2"
              v-for="header in columnHeaders"
              :key="header.title"
              @click="sort(header.title)"
            >
              {{ header.label }}
              &ensp;
              <span
                v-if="
                  sortDirectionMap.get(header.title) &&
                  lastClickedColumn === header.title
                "
              >
                &ensp;<span v-if="sortDirectionMap.get(header.title) === 'asc'"
                  >&uarr;</span
                >
                <span v-else-if="sortDirectionMap.get(header.title) === 'desc'"
                  >&darr;</span
                >
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="4">
              <section className="loading_section">
                <div className="wrapper_loader">
                  <div className="snippet" data-title="dot-overtaking">
                    <div className="stage filter-contrast">
                      <div className="dot-overtaking" />
                    </div>
                  </div>
                  <h4 class="mt-6">Loading ...</h4>
                </div>
              </section>
            </td>
          </tr>
          <tr
            v-else-if="!loading && filteredData[0].features.items.length <= 0"
          >
            <td colspan="4" class="text-center py-14">No data found!</td>
          </tr>
          <tr
            v-else
            v-for="item in filteredData[0].features.items"
            :key="item.id"
          >
            <td class="px-6 py-4 text-sm font-medium text-gray-800">
              {{ item.name }}
            </td>
            <td
              class="px-6 py-4 text-sm font-medium text-gray-800 max-w-[10rem]"
            >
              {{ item.description }}
            </td>
            <td class="px-6 py-4 text-sm font-medium text-gray-800">
              {{ formattedEditions(item.FeatureEditions) }}
            </td>
            <td class="px-6 py-4 text-sm font-medium text-gray-800">
              {{ formattedTimeOfCapture(item.screenshots) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
