import app from './app';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: https://ucad-server-https.northeurope.cloudapp.azure.com:${port}`);
});
