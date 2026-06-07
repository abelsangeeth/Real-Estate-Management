import app from '../src/app';

export default function handler(req: any, res: any) {
  app.ready((err) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    app.server.emit('request', req, res);
  });
}
