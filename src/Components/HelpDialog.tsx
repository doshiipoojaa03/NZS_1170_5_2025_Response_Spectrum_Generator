import React from "react";
import {
  GuideBox,
  Typography,
  Dialog,
  Icon,
  Button,
} from "@midasit-dev/moaui";

const CompHelpDialog = (props: any) => {
  const [open, setOpen] = React.useState(false);

  return (
    <GuideBox horLeft verCenter>
      <Icon iconName="Help" toButton onClick={() => setOpen(true)} />
      <Dialog
        open={open}
        setOpen={setOpen}
        headerIcon={<Icon iconName="InfoOutlined" />}
        headerTitle="NZS 1170.5:2025 Response Spectrum Generator"
      >
        <GuideBox spacing={2}>
          <GuideBox spacing={1}>
            <GuideBox row spacing={0.7}>
              <Typography variant="h1">Generate Design Spectrum</Typography>
            </GuideBox>
            <GuideBox paddingLeft={1}>
              <Typography variant="body1">
                This plug-in generates the Design Response Spectrum in
                accordance with NZS 1170.5:2025 (SNZ TS 1170.5:2025).
              </Typography>
              <Typography variant="body1">
                Both Horizontal Cd(T) and Vertical Cv(T) spectra are supported.
              </Typography>
            </GuideBox>
          </GuideBox>
          <GuideBox spacing={1}>
            <GuideBox row spacing={0.7}>
              <Typography variant="h1">Details</Typography>
            </GuideBox>
            <GuideBox paddingLeft={1}>
              <Typography variant="body1">version 1.0.0</Typography>
              <Typography variant="body1">
                Hazard parameters PGA, Sa,s, Tc, Td are obtained from Table 3.1
                (named locations) or Table 3.2 (grid points) per site class and
                annual probability of exceedance.
              </Typography>
            </GuideBox>
          </GuideBox>
          <GuideBox spacing={1}>
            <GuideBox row spacing={0.7}>
              <Typography variant="h1">How to use</Typography>
            </GuideBox>
            <GuideBox row spacing={2} verCenter>
              <Button color="negative">Update</Button>
              <Typography>Enter spectral data to program</Typography>
            </GuideBox>
          </GuideBox>
        </GuideBox>
      </Dialog>
    </GuideBox>
  );
};

export default CompHelpDialog;