import { init } from './app';
import { Pool } from './pool';
const port = process.env.SERVER_PORT;

Pool.initPool();

init().then(app => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
})
