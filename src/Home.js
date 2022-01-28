import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SpaceBar from '@mui/icons-material/SpaceBar';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ThumbsUpDownOutlinedIcon from '@mui/icons-material/ThumbsUpDownOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';

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

export default function Home() {

  const [text, setText] = useState('Raris mabejug daun bilané marupa lingga');
  const [fixedText, setFixedText] = useState('Raris mabaju daun bulane mrupa linga.');
  const [loading, setLoading] = useState(false);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestedText, setSuggestedText] = useState('Raris mabaju daun bulane mrupa linga. ');

  const [openDialog, setOpenDialog] = useState(false);
  const [openSuggestionConfirm, setOpenSuggestionConfirm] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const spellCorrect = (event) => {
    event.preventDefault();
    setLoading(true)
    axios.get('https://api.tetun.org/ban-spell-correct', { params: {text}})
      .then(response => {
        const result = response.data.result
        setFixedText(result)
        setSuggestedText(result)
        setLoading(false)
      }).catch((error) => {
        setLoading(false)
        // eslint-disable-next-line no-alert
        window.alert(error);
      });
  };

  const sendSuggestion = (event) => {
    event.preventDefault();
    setLoadingSuggestion(true)
    axios.post('https://api.tetun.org/create-suggestion', {
      initial: text,
      corrected: fixedText,
      suggestion: suggestedText,
    }).then(response => {
        setOpenDialog(false)
        setFixedText(suggestedText)
        setLoadingSuggestion(false)
        setOpenSuggestionConfirm(true)
      }).catch((error) => {
        setLoadingSuggestion(false)
        // eslint-disable-next-line no-alert
        window.alert(error);
      });
  };

  return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            marginBottom: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <SpaceBar />
          </Avatar>
          <Typography component="h1" variant="h5">
            Balinese Spell Checker
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
              spellCheck={false}
              value={text}
              multiline
              autoFocus
            />
            <LoadingButton
              onClick={spellCorrect}
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 3 }}
              loading={loading}
            >
              Fix spelling
            </LoadingButton>
            <Grid container>
              {fixedText}
            </Grid>
          </Box>
        </Box>
        {fixedText && <Grid
          container
          direction="row"
          justifyContent="flex-end"
          >
            <Tooltip title="Edit spelling">
              <IconButton onClick={handleClickOpen}>
                <ThumbsUpDownOutlinedIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy">
              <IconButton
                onClick={() => {navigator.clipboard.writeText(fixedText)}}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
        </Grid> }
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Edit spelling</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your contribution will improve the quality of the Balinese spell checker.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="suggestion"
            fullWidth
            variant="standard"
            multiline
            value={suggestedText}
            onChange={e => setSuggestedText(e.target.value)}
            spellCheck={false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            onClick={sendSuggestion}
            loading={loadingSuggestion}
          >
            Send
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSuggestionConfirm}
        autoHideDuration={6000}
        onClose={() => setOpenSuggestionConfirm(false)}
        message="Thank you for the spelling suggestion!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
        <Copyright sx={{ mt: 12, mb: 4 }} />
      </Container>
  );
}
