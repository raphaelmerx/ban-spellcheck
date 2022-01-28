import { createTheme } from '@mui/material/styles';
import shape from './shape';
import palette from './palette';
import typography from './typography';
import shadows, { customShadows } from './shadows';

const customTheme = createTheme({
  palette,
  shape,
  typography,
  shadows,
  customShadows
});

export default customTheme
