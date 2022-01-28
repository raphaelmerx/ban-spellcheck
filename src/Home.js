import React, { useEffect, useState } from 'react';
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

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || 'https://api.tetun.org';

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

function SuggestionDialog(props) {
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [openSuggestionConfirm, setOpenSuggestionConfirm] = useState(false);
  const [suggestedText, setSuggestedText] = useState(props.fixedText);

  useEffect(() => {
    setSuggestedText(props.fixedText)
  }, [props.fixedText]);


  const closeDialog = () => {
    props.setOpen(false);
  };

  const sendSuggestion = (event) => {
    event.preventDefault();
    setLoadingSuggestion(true)
    axios.post(`${API_ENDPOINT}/create-suggestion`, {
      initial: props.initialText,
      corrected: props.fixedText,
      suggestion: suggestedText,
    }).then(response => {
        props.setOpen(false)
        props.onSuccess(suggestedText)
        setLoadingSuggestion(false)
        setOpenSuggestionConfirm(true)
      }).catch((error) => {
        setLoadingSuggestion(false)
        // eslint-disable-next-line no-alert
        window.alert(error);
      });
  };

  return (
    <React.Fragment>
      <Dialog open={props.open} onClose={closeDialog}>
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
          <Button onClick={closeDialog}>Cancel</Button>
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
    </React.Fragment>
  )
}

export default function Home() {

  const [text, setText] = useState('');
  const [fixedText, setFixedText] = useState('');
  const [loading, setLoading] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const spellCorrect = (event) => {
    event.preventDefault();
    setLoading(true)
    axios.get(`${API_ENDPOINT}/ban-spell-correct`, { params: {text}})
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
              <IconButton onClick={e => setOpenDialog(true)}>
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
      <SuggestionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        initialText={text}
        fixedText={fixedText}
        onSuccess={savedText => setFixedText(savedText)}
      ></SuggestionDialog>
        <Copyright sx={{ mt: 12, mb: 4 }} />
      </Container>
  );
}
