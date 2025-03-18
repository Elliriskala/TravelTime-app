import app from './app';

const port = process.env.PORT || 3001;
const server = 'https://ucad-server-https.northeurope.cloudapp.azure.com';

app.listen(port, () => {
  console.log(`Listening: ${server}:${port}`);
});
