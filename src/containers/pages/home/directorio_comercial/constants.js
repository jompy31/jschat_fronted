const CHUNK_SIZE = 100;
const ROW_HEIGHT = 60;
const ITEMS_PER_COLUMN = 20;
const COLUMN_BLOCK_HEIGHT = ROW_HEIGHT * (ITEMS_PER_COLUMN / 1.3);
const CACHE_KEY = "distributors_cache";

const directions1 = {
  "Costa Rica": "CR",
  Nicaragua: "NI",
  Panama: "PA",
  Colombia: "CO",
  Venezuela: "VE",
  Honduras: "HN",
  "El Salvador": "SV",
  Mexico: "MX",
  Belice: "BZ",
  Guatemala: "GT",
};

export { CHUNK_SIZE, ROW_HEIGHT, ITEMS_PER_COLUMN, COLUMN_BLOCK_HEIGHT, CACHE_KEY, directions1 };