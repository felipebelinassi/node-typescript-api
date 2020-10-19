import '../util/module-alias';
import express from 'express';
import routes from '../routes';

const app = express();

app.use(express.json());
app.use(routes);

export const server = app.listen(3000, () => {
  console.log('Application listening at port 3000');
});
