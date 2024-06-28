import * as React from 'react';
import { CircularProgress, Box } from '@mui/material';
import styled from 'styled-components';

const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const Loading = () => (
  <CenteredBox>
    <CircularProgress style={{ color: 'blue' }} />
  </CenteredBox>
);

export default Loading;
