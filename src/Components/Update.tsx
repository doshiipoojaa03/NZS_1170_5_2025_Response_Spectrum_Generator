import React from "react";
import { useSnackbar } from "notistack";
import { useRecoilValue } from "recoil";
import {
  VarDesignSpectrum,
  VarFuncName,
  VarMaximumPeriod,
  VarValids,
  getDesignSpectrumCodeName,
  VarNZS1170_5_2025_SpectrumType,
  VarNZS1170_5_2025_SiteClass,
  VarNZS1170_5_2025_PGA,
  VarNZS1170_5_2025_Sa_s,
  VarNZS1170_5_2025_Tc,
  VarNZS1170_5_2025_Td,
  VarNZS1170_5_2025_Mu,
  VarNZS1170_5_2025_Sp,
  VarNZS1170_5_2025_FaultDistance,
} from "./variables";
import {
  GuideBox,
  Button,
  TemplatesFunctionalComponentsValidCheckDialog,
} from "@midasit-dev/moaui";
import { spfcUpdate4NZS1170_5_2025, setGlobalVariable } from "../utils_pyscript";

const CompUpdate = () => {
  const design_spectrum = useRecoilValue(VarDesignSpectrum);
  const [open, setOpen] = React.useState(false);

  return (
    <GuideBox horRight width="50%">
      <Button color="negative" onClick={() => setOpen(true)}>
        Update
      </Button>
      {design_spectrum === 1 && (
        <CompValidCheckDialogNZS117052025
          open={open}
          setOpen={setOpen}
          design_spectrum={design_spectrum}
        />
      )}
    </GuideBox>
  );
};

export default CompUpdate;

// ─── NZS 1170.5 (2025) valid-check dialog ────────────────────────────────────
// Modelled after CompValidCheckDialogUNE199812011:
//   - conditional checklist rows based on spectrum type (H vs V)
//   - same baseCheckList.push() pattern
//   - same spfcUpdate call structure
const CompValidCheckDialogNZS117052025 = (props: any) => {
  const { open, setOpen, design_spectrum } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [checkList, setCheckList] = React.useState<any>([]);

  const func_name      = useRecoilValue(VarFuncName);
  const spectrum_type  = useRecoilValue(VarNZS1170_5_2025_SpectrumType);
  const site_class     = useRecoilValue(VarNZS1170_5_2025_SiteClass);
  const pga            = useRecoilValue(VarNZS1170_5_2025_PGA);
  const sa_s           = useRecoilValue(VarNZS1170_5_2025_Sa_s);
  const tc             = useRecoilValue(VarNZS1170_5_2025_Tc);
  const td             = useRecoilValue(VarNZS1170_5_2025_Td);
  const mu             = useRecoilValue(VarNZS1170_5_2025_Mu);
  const sp             = useRecoilValue(VarNZS1170_5_2025_Sp);
  const fault_distance = useRecoilValue(VarNZS1170_5_2025_FaultDistance);
  const maximum_period = useRecoilValue(VarMaximumPeriod);
  const valids         = useRecoilValue(VarValids);

  React.useEffect(() => {
    // Base checklist — always present
    const baseCheckList = [
      {
        title: "Function Name",
        value: func_name,
        error: !valids.VarFunctionName(func_name),
        reason: "The length of name must be greater than 0.",
      },
      {
        title: "Design Spectrum",
        value: getDesignSpectrumCodeName(design_spectrum),
        error: !valids.VarDesignSpectrum(design_spectrum),
        reason: "",
      },
      {
        title: "Spectrum Type",
        value: spectrum_type === 1
          ? "Horizontal Design Spectrum"
          : "Vertical Design Spectrum",
        error: !valids.VarNZS1170_5_2025_SpectrumType(spectrum_type),
        reason: "",
      },
      {
        title: "Site Class",
        value: site_class,
        error: !valids.VarNZS1170_5_2025_SiteClass(site_class),
        reason: "",
      },
      {
        title: "PGA (g)",
        value: pga,
        error: !valids.VarNZS1170_5_2025_PGA(pga),
        reason: "PGA must be greater than 0.",
      },
      {
        title: "Short Period Spectral Acc. Sa,s (g)",
        value: sa_s,
        error: !valids.VarNZS1170_5_2025_Sa_s(sa_s),
        reason: "Sa,s must be greater than 0.",
      },
      {
        title: "Acc. Plateau Corner Period Tc (s)",
        value: tc,
        error: !valids.VarNZS1170_5_2025_Tc(tc),
        reason: "Tc must be greater than 0.",
      },
      {
        title: "Vel. Plateau Corner Period Td (s)",
        value: td,
        error: !valids.VarNZS1170_5_2025_Td(td),
        reason: "Td must be greater than 0.",
      },
    ];

    // Horizontal Design Spectrum → show μ and Sp (Cd(T) = C(T)·Sp/kμ)
    if (spectrum_type === 1) {
      baseCheckList.push({
        title: "Structural Ductility Factor (μ)",
        value: mu,
        error: !valids.VarNZS1170_5_2025_Mu(mu),
        reason: "μ must be greater than 0.",
      });
      baseCheckList.push({
        title: "Structural Performance Factor (Sp)",
        value: sp,
        error: !valids.VarNZS1170_5_2025_Sp(sp),
        reason: "Sp must be greater than 0.",
      });
    }

    // Vertical Design Spectrum → show fault distance (0.7× reduction when ≤ 10 km)
    if (spectrum_type === 2) {
      baseCheckList.push({
        title: "Distance From Nearest Major Fault (km)",
        value: fault_distance,
        error: !valids.VarNZS1170_5_2025_FaultDistance(fault_distance),
        reason: "Fault distance must be greater than 0.",
      });
    }

    baseCheckList.push({
      title: "Maximum Period (s)",
      value: maximum_period,
      error: !valids.VarMaximumPeriod(maximum_period),
      reason: "Maximum Period must be greater than 0.",
    });

    setCheckList(baseCheckList);
  }, [
    func_name,
    design_spectrum,
    spectrum_type,
    site_class,
    pga,
    sa_s,
    tc,
    td,
    mu,
    sp,
    fault_distance,
    maximum_period,
    valids,
  ]);

  return (
    <TemplatesFunctionalComponentsValidCheckDialog
      open={open}
      setOpen={setOpen}
      checkList={checkList}
      buttonText="Update"
      buttonClick={() => {
        // Always inject MAPI key before writing to Midas
        setGlobalVariable();

        const effective_mu = spectrum_type === 1 ? mu : "1";
        const effective_sp = spectrum_type === 1 ? sp : "1";

        const result = spfcUpdate4NZS1170_5_2025(
          func_name,
          pga,
          sa_s,
          tc,
          td,
          effective_mu,
          effective_sp,
          fault_distance,
          maximum_period,
          spectrum_type === 1 ? "H" : "V"
        );

        if ("error" in result) {
          enqueueSnackbar(result.error, { variant: "error" });
        }
        console.log(result);

        if ("success" in result) {
          enqueueSnackbar(result.success, {
            variant: "success",
            autoHideDuration: 1500,
          });
        }
      }}
      maxPanelRows={11}
    />
  );
};