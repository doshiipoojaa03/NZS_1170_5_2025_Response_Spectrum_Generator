import React from "react";
import {
  Panel,
  GuideBox,
  Typography,
  Dialog,
  IconButton,
  Icon,
  DropList,
} from "@midasit-dev/moaui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  VarValids,
  VarNZS1170_5_2025_SpectrumType,
  VarNZS1170_5_2025_SpectrumTypeList,
  VarNZS1170_5_2025_SiteClass,
  VarNZS1170_5_2025_SiteClassList,
  VarNZS1170_5_2025_PGA,
  VarNZS1170_5_2025_Sa_s,
  VarNZS1170_5_2025_Tc,
  VarNZS1170_5_2025_Td,
  VarNZS1170_5_2025_Mu,
  VarNZS1170_5_2025_Sp,
  VarNZS1170_5_2025_FaultDistance,
} from "./variables";
import CompTypographyAndTextFieldNumOnly from "./TypographyAndTextFieldNumOnly";

const CompSeismicData_NZS1170_5_2025 = () => {
  const valids      = useRecoilValue(VarValids);
  const spectrumType = useRecoilValue(VarNZS1170_5_2025_SpectrumType);

  const [pga,           setPga]          = useRecoilState(VarNZS1170_5_2025_PGA);
  const [sa_s,          setSa_s]         = useRecoilState(VarNZS1170_5_2025_Sa_s);
  const [tc,            setTc]           = useRecoilState(VarNZS1170_5_2025_Tc);
  const [td,            setTd]           = useRecoilState(VarNZS1170_5_2025_Td);
  const [mu,            setMu]           = useRecoilState(VarNZS1170_5_2025_Mu);
  const [sp,            setSp]           = useRecoilState(VarNZS1170_5_2025_Sp);
  const [faultDistance, setFaultDistance] = useRecoilState(VarNZS1170_5_2025_FaultDistance);
  const [,              setSiteClass]    = useRecoilState(VarNZS1170_5_2025_SiteClass);

  // Per spec:
  //   Horizontal (1): all fields active
  //   Vertical   (2): μ and Sp disabled
  const isVertical = spectrumType === 2;
  const isNearFault = isVertical && parseFloat(faultDistance) <= 10;
 
  React.useEffect(() => {
    if (isNearFault) {
      setSiteClass("I");
    }
  }, [isNearFault, setSiteClass]);

  return (
    <GuideBox overflow="visible" width={368}>
      <Panel variant="strock" width="100%" padding={2}>
        <GuideBox show fill="1" row borderRadius={1} center marginBottom={1}>
          <Typography variant="h1">Seismic Data</Typography>
          <CompInfoDialog />
        </GuideBox>
 
        <GuideBox width="100%" spacing={2}>
          {/* Spectrum Type dropdown */}
          <CompSpectrumType />
 
          {/* Site Class dropdown */}
          <CompSiteClass />
 
          {/* 1. Fault distance — active for both H and V per spec */}
          <CompTypographyAndTextFieldNumOnly
            title="Distance From Nearest Major Fault (km)"
            state={faultDistance}
            setState={setFaultDistance}
            error={!valids.VarNZS1170_5_2025_FaultDistance(faultDistance)}
            height={20}
            step={1}
          />
 
          {/* 2. Hazard parameters — active for both H and V */}
          <CompTypographyAndTextFieldNumOnly
            title="PGA"
            state={pga}
            setState={setPga}
            error={!valids.VarNZS1170_5_2025_PGA(pga)}
            height={25}
            step={0.01}
          />
          <CompTypographyAndTextFieldNumOnly
            title="Short Period Spectral Accelaration (Sₐ,ₛ)"
            state={sa_s}
            setState={setSa_s}
            error={!valids.VarNZS1170_5_2025_Sa_s(sa_s)}
            height={20}
            step={0.01}
          />
          <CompTypographyAndTextFieldNumOnly
            title="Spectral Acceleration Plateau Corner Period (Tc)"
            state={tc}
            setState={setTc}
            error={!valids.VarNZS1170_5_2025_Tc(tc)}
            height={20}
            step={0.01}
          />
          <CompTypographyAndTextFieldNumOnly
            title="Spectral Velocity Plateau Corner Period (Td)"
            state={td}
            setState={setTd}
            error={!valids.VarNZS1170_5_2025_Td(td)}
            height={20}
            step={0.1}
          />
 
          {/* 3. Structural parameters — disabled for Vertical per spec */}
          <CompTypographyAndTextFieldNumOnly
            title="Structural Ductility Factor (μ)"
            state={mu}
            setState={setMu}
            error={!isVertical && !valids.VarNZS1170_5_2025_Mu(mu)}
            disabled={isVertical}
            height={20}
            step={0.1}
          />
          <CompTypographyAndTextFieldNumOnly
            title="Structural Performance Factor (Sₚ)"
            state={sp}
            setState={setSp}
            error={!isVertical && !valids.VarNZS1170_5_2025_Sp(sp)}
            disabled={isVertical}
            height={20}
            step={0.1}
          />
        </GuideBox>
      </Panel>
    </GuideBox>
  );
};

export default CompSeismicData_NZS1170_5_2025;

// ─── Spectrum Type dropdown — mirrors CompSpectrumType in UNE ─────────────────
const CompSpectrumType = () => {
  const [spectrumType, setSpectrumType] = useRecoilState(VarNZS1170_5_2025_SpectrumType);
  const spectrumTypeList = useRecoilValue(VarNZS1170_5_2025_SpectrumTypeList);

  return (
    <GuideBox width="100%" row horSpaceBetween>
      <GuideBox width="inherit" row horSpaceBetween verCenter height={30}>
        <Typography variant="h1" height={30} verCenter>
          Spectrum Type
        </Typography>
        <DropList
          width={200}
          itemList={new Map<string, number>(spectrumTypeList as [string, number][])}
          defaultValue={spectrumType}
          value={spectrumType}
          onChange={(e: any) => setSpectrumType(e.target.value)}
          listWidth={200}
        />
      </GuideBox>
    </GuideBox>
  );
};

// ─── Site Class dropdown — mirrors CompGroundType in UNE ─────────────────────
const CompSiteClass = () => {
  const [siteClass, setSiteClass] = useRecoilState(VarNZS1170_5_2025_SiteClass);
  const siteClassList = useRecoilValue(VarNZS1170_5_2025_SiteClassList);

  return (
    <GuideBox width="100%" row horSpaceBetween>
      <GuideBox width="inherit" row horSpaceBetween verCenter height={30}>
        <Typography variant="h1" height={30} verCenter>
          Ground Type
        </Typography>
        <DropList
          width={200}
          itemList={new Map<string, string>(siteClassList)}
          defaultValue={siteClass}
          value={siteClass}
          onChange={(e: any) => setSiteClass(e.target.value)}
          listWidth={200}
        />
      </GuideBox>
    </GuideBox>
  );
};

// ─── Info dialog ──────────────────────────────────────────────────────────────
const CompInfoDialog = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <GuideBox>
      <IconButton onClick={() => setOpen(true)} transparent>
        <Icon iconName="InfoOutlined" />
      </IconButton>
      <Dialog
        open={open}
        setOpen={setOpen}
        headerIcon={<Icon iconName="InfoOutlined" />}
        headerTitle="Seismic Data : NZS 1170.5 (2025)"
      >
        <GuideBox spacing={2}>
          {/* <Typography variant="h1">- Spectrum Type:</Typography>
          <Typography variant="body1">
            Horizontal Design Spectrum → Cd(T) = C(T)·Sp/kμ (Eq. 5.3)
          </Typography>
          <Typography variant="body1">
            Vertical Design Spectrum → Cv(Tv) per Section 3.2 / 5.5.
            Reduced by 0.7× when fault distance ≤ 10 km.
          </Typography> */}

          <Typography variant="h1">- Ground Type:</Typography>
          <Typography variant="body1">
            I,II,III,IV,V,VI (Refer to NZS 1170.5 (2025) Table 3.3)
          </Typography>

          <Typography variant="h1">- Distance From Nearest Major Fault (km):</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Table 3.4
          </Typography>

          <Typography variant="h1">- PGA:</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Section 3.2.1
          </Typography>

          <Typography variant="h1">- Short Period Spectral Acceleration:</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Table 3.1
          </Typography>

          <Typography variant="h1">- Spectral Acceleration Plateau Corner Period:</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Table 3.1
          </Typography>

		  <Typography variant="h1">- Spectral Velocity Plateau Corner Period:</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Table 3.1
          </Typography>

		  <Typography variant="h1">- Structural Ductility Factor:</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Table 4.3
          </Typography>

		  <Typography variant="h1">- Structural Performance Factor:</Typography>
          <Typography variant="body1">
            Refer to NZS 1170.5 (2025) Table 4.4
          </Typography>

		  <Typography variant="h1">Note - Refer to NZS 1170.5 (2025) Table 3.1 for the selected Ground Type.</Typography>
        </GuideBox>
      </Dialog>
    </GuideBox>
  );
};