import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SpaceBar from '@mui/icons-material/SpaceBar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import axios from 'axios';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Built using '}
      <Link color="inherit" href="https://github.com/mammothb/symspellpy">
        SymSpell
      </Link>{' '}
      {'trained on '}
      <Link color="inherit" href="https://ban.wikipedia.org/">
        Balinese Wikipedia
      </Link>{' data '}
      <Link color="inherit" href="https://github.com/raphaelmerx/ban-spellcheck">
        (source)
      </Link>
    </Typography>
  );
}

const theme = createTheme();

export default function Home() {

  const [text, setText] = useState('');
  const [fixedText, setFixedText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true)
    axios.get('https://api.tetun.org/ban-spell-correct', { params: {text}})
      .then(response => {
        const result = response.data.result
        setFixedText(result)
        setLoading(false)
      }).catch((error) => {
        setLoading(false)
        // eslint-disable-next-line no-alert
        window.alert(error);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SpaceBar />
          </Avatar>
          <Typography component="h1" variant="h5">
            Balinese Spell Fixer
          </Typography>
        </Box>
        <Box>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="ban-text"
              label="Balinese text to correct"
              name="ban-text"
              minRows="3"
              onChange={e => setText(e.target.value)}
              multiline
              autoFocus
            />
            <LoadingButton
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 3 }}
              loading={loading}
            >
              Fix spaces
            </LoadingButton>
            <Grid container>
              {fixedText}
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
