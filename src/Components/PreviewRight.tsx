import React from "react";
import { ChartLine, Color, GuideBox, Typography } from "@midasit-dev/moaui";
import { createGraphData4NZS1170_5_2025 } from "../utils_pyscript";
import {
  VarDesignSpectrum,
  VarMaximumPeriod,
  VarValids,
  VarNZS1170_5_2025_SpectrumType,
  VarNZS1170_5_2025_PGA,
  VarNZS1170_5_2025_Sa_s,
  VarNZS1170_5_2025_Tc,
  VarNZS1170_5_2025_Td,
  VarNZS1170_5_2025_Mu,
  VarNZS1170_5_2025_Sp,
  VarNZS1170_5_2025_FaultDistance,
} from "./variables";
import { useRecoilValue } from "recoil";
import { useSnackbar } from "notistack";

interface ChartData {
  id: string;
  color: string;
  data: { x: string; y: string }[];
}

const CompPreviewRight = () => {
  const varValids       = useRecoilValue(VarValids);
  const design_spectrum = useRecoilValue(VarDesignSpectrum);
  const maximum_period  = useRecoilValue(VarMaximumPeriod);

  // NZS 1170.5 (2025) values
  const spectrum_type   = useRecoilValue(VarNZS1170_5_2025_SpectrumType);
  const pga             = useRecoilValue(VarNZS1170_5_2025_PGA);
  const sa_s            = useRecoilValue(VarNZS1170_5_2025_Sa_s);
  const tc              = useRecoilValue(VarNZS1170_5_2025_Tc);
  const td              = useRecoilValue(VarNZS1170_5_2025_Td);
  const mu              = useRecoilValue(VarNZS1170_5_2025_Mu);
  const sp              = useRecoilValue(VarNZS1170_5_2025_Sp);
  const fault_distance  = useRecoilValue(VarNZS1170_5_2025_FaultDistance);

  const [loading, setLoading]     = React.useState(false);
  const { enqueueSnackbar }       = useSnackbar();
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const processing                = React.useRef(false);

  React.useEffect(() => {
    if (processing.current) {
      processing.current = false;
      return;
    }

    setLoading(true);
    processing.current = true;

    setTimeout(() => {
      try {
        let result = null;

        // NZS 1170.5 (2025)
        if (design_spectrum === 1) {
          // Resolve effective parameters based on spectrum type
          // Horizontal: uses mu, sp (design spectrum)
          // Vertical:   mu=1, sp=1 (elastic-style), but fault distance reduction applies
          const effective_mu = spectrum_type === 1 ? mu : "1";
          const effective_sp = spectrum_type === 1 ? sp : "1";

          result = createGraphData4NZS1170_5_2025(
            pga,
            sa_s,
            tc,
            td,
            effective_mu,
            effective_sp,
            fault_distance,
            maximum_period
          );
        }

        const arrX = result.period;
        // NZ_input_2025 returns value_h (horizontal) and value_v (vertical)
        const arrY = spectrum_type === 1 ? result.value_h : result.value_v;

        if (!arrX || !arrY || arrX.length !== arrY.length) {
          enqueueSnackbar("Creating graph data is failed (Calc Input Error)", {
            variant: "error",
          });
          throw new Error("Creating graph data is failed (Calc Input Error)");
        }

        const data_of_chart = [];
        for (let i = 0; i < arrX.length; i++) {
          data_of_chart.push({ x: arrX[i], y: arrY[i] });
        }

        setChartData([
          {
            id: spectrum_type === 1 ? "Horizontal Cd(T)" : "Vertical Cv(T)",
            color: Color.secondary.main,
            data: data_of_chart,
          },
        ]);
      } catch (e: any) {
        console.error(e);
      } finally {
        enqueueSnackbar("Updating graph data is successfully", {
          variant: "success",
          autoHideDuration: 1500,
        });
        setLoading(false);
        processing.current = false;
      }
    }, 500);
  }, [
    varValids,
    design_spectrum,
    spectrum_type,
    pga,
    sa_s,
    tc,
    td,
    mu,
    sp,
    fault_distance,
    maximum_period,
    enqueueSnackbar,
  ]);

  return (
    <GuideBox height="100%" verSpaceBetween>
      <GuideBox show fill="1" width="100%" center padding={1} borderRadius={1}>
        <Typography variant="h1">Preview Design Spectrum</Typography>
      </GuideBox>
      <GuideBox loading={loading} center>
        <CompChartLeftBottom data={chartData} />
      </GuideBox>
    </GuideBox>
  );
};

export default CompPreviewRight;

const CompChartLeftBottom = (props: any) => {
  const { data } = props;

  return (
    <ChartLine
      width={500}
	  height={500}
      data={data}
      axisBottom
      axisBottomTickValues={5}
      axisBottomDecimals={2}
      axisBottomTickRotation={0}
      axisBottomLegend="Period (sec)"
      axisBottomLegendOffset={50}
      axisLeft
      axisLeftTickValues={5}
      axisLeftDecimals={5}
      axisLeftTickRotation={0}
      axisLeftLegend="Spectral Data"
      axisLeftLegendOffset={-80}
      marginTop={20}
      marginRight={20}
      marginLeft={90}
      marginBottom={60}
      pointSize={0}
      xDecimals={2}
      yDecimals={4}
    />
  );
};