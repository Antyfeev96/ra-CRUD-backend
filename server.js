const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const { nanoid } = require('nanoid')

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const notes = [
    {
      key: nanoid(5),
      id: 1,
      content: 'Скушать гречу'
    },
    {
      key: nanoid(5),
      id: 2,
      content: 'Показать ей lorem ipsum'
    },
    {
      key: nanoid(5),
      id: 3,
      content: 'Заметка № 3'
    }
];

let nextId = notes.length + 1;

const router = new Router();

router.get('/notes', async (ctx, next) => {
  ctx.response.body = JSON.stringify(notes);
});

router.post('/notes', async(ctx, next) => {
  const body = JSON.parse(ctx.request.body);
  notes.push({...body, id: nextId++, key: nanoid(5)});
  ctx.response.status = 204;
});

router.delete('/notes/:id', async(ctx, next) => {
  const noteId = Number(ctx.params.id);
  const index = notes.findIndex(o => o.id === noteId);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));