import { atom } from "recoil";
import { isLargerThanZero } from "../utils";

// if true, it is Valid
export const VarValids = atom({
  key: "Errors",
  default: {
    VarFunctionName:  (value: any) => value !== "",
    VarDesignSpectrum:(value: any) => true,
    VarMaximumPeriod: (value: any) => isLargerThanZero(value),

    // NZS 1170.5 (2025)
    VarNZS1170_5_2025_SpectrumType:     (value: any) => true,
    VarNZS1170_5_2025_SiteClass:        (value: any) => true,
    VarNZS1170_5_2025_PGA:              (value: any) => isLargerThanZero(value),
    VarNZS1170_5_2025_Sa_s:             (value: any) => isLargerThanZero(value),
    VarNZS1170_5_2025_Tc:               (value: any) => isLargerThanZero(value),
    VarNZS1170_5_2025_Td:               (value: any) => isLargerThanZero(value),
    VarNZS1170_5_2025_Mu:               (value: any) => isLargerThanZero(value),
    VarNZS1170_5_2025_Sp:               (value: any) => isLargerThanZero(value),
    VarNZS1170_5_2025_FaultDistance:    (value: any) => isLargerThanZero(value),
  },
});

// ─── Shared ───────────────────────────────────────────────────────────────────
export const VarFuncName = atom({
  key: "VarFuncName",
  default: "",
});

export const VarMaximumPeriod = atom({
  key: "VarMaximumPeriod",
  default: "6.0",
});

// Design Spectrum dropdown — only SNZ TS 1170.5:2025
const designSpectrumCodes: Array<[string, number]> = [
  ["SNZ TS 1170.5:2025", 1],
];
export const VarDesignSpectrumList = atom({
  key: "VarDesignSpectrumList",
  default: designSpectrumCodes,
});
export const getDesignSpectrumCodeName = (index: number): string => {
  if (designSpectrumCodes.length !== 0 && designSpectrumCodes[index - 1]) {
    return designSpectrumCodes[index - 1][0];
  }
  return "";
};
export const VarDesignSpectrum = atom({
  key: "VarDesignSpectrum",
  default: 1,
});

// ─── SNZ  TS 1170.5 : 2025 atoms ─────────────────────────────────────────────────
// Spectrum type dropdown — mirrors UNE spectrumType pattern
const nzs_spectrumType: Array<[string, number]> = [
  ["Horizontal Design Spectrum", 1],
  ["Vertical Design Spectrum",   2],
];
export const VarNZS1170_5_2025_SpectrumTypeList = atom({
  key: "VarNZS1170_5_2025_SpectrumTypeList",
  default: nzs_spectrumType,
});
export const VarNZS1170_5_2025_SpectrumType = atom({
  key: "VarNZS1170_5_2025_SpectrumType",
  default: 1,
});

// Site class dropdown — mirrors UNE groundType DropList pattern
const nzs_siteClass: [string, string][] = [
  ["I", "I"],
  ["II", "II"],
  ["III", "III"],
  ["IV", "IV"],
  ["V", "V"],
  ["VI","VI"],
//   ["VII — Site-specific analysis required",       "VII"],
];
export const VarNZS1170_5_2025_SiteClassList = atom<[string, string][]>({
  key: "VarNZS1170_5_2025_SiteClassList",
  default: nzs_siteClass,
});
export const VarNZS1170_5_2025_SiteClass = atom({
  key: "VarNZS1170_5_2025_SiteClass",
  default: "II",
});

// Hazard parameters — from Table 3.1 (named location) or Table 3.2 (grid point)
export const VarNZS1170_5_2025_PGA = atom({
  key: "VarNZS1170_5_2025_PGA",
  default: "0.13",   // Auckland, Site Class II, 1/500
});
export const VarNZS1170_5_2025_Sa_s = atom({
  key: "VarNZS1170_5_2025_Sa_s",
  default: "0.29",
});
export const VarNZS1170_5_2025_Tc = atom({
  key: "VarNZS1170_5_2025_Tc",
  default: "0.35",
});
export const VarNZS1170_5_2025_Td = atom({
  key: "VarNZS1170_5_2025_Td",
  default: "3.1",
});

// Structural parameters — Section 4.3 and 4.4
export const VarNZS1170_5_2025_Mu = atom({
  key: "VarNZS1170_5_2025_Mu",
  default: "1.0",
});
export const VarNZS1170_5_2025_Sp = atom({
  key: "VarNZS1170_5_2025_Sp",
  default: "0.7",
});

// Site parameter — Section 3.2
// Vertical spectrum is reduced by 0.7× when fault distance ≤ 10 km
export const VarNZS1170_5_2025_FaultDistance = atom({
  key: "VarNZS1170_5_2025_FaultDistance",
  default: "25.0",
});