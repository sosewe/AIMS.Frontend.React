// Themes
export const THEMES = {
  DEFAULT: "DEFAULT",
  DARK: "DARK",
  LIGHT: "LIGHT",
  BLUE: "BLUE",
  GREEN: "GREEN",
  INDIGO: "INDIGO",
};

export const REPORT_FREQUENCY = {
  ANNUALLY: "6D8FC9CA-AC89-11EB-8529-0242AC130003",
  MONTHLY: "6D8FC614-AC89-11EB-8529-0242AC130003",
  QUARTERLY: "6D8FC8BC-AC89-11EB-8529-0242AC130003",
};

export const SHARED_DIRECTORY = {
  INNOVATION: "amref.remote.address/edms/",
  ADVOCACY: "amref.remote.address/edms/",
  TECHNICALASSISTANCE: "amref.remote.address/edms/",
  LEARNING: "amref.remote.address/edms/",
};

var start = new Date();
export const YEAR_RANGE = {
  MIN_YEAR: new Date(new Date().setYear(start.getFullYear() - 5)),
  MAX_YEAR: new Date(new Date().setYear(start.getFullYear() + 5)),
};
