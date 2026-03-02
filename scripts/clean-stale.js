import { unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
for (const name of ['index.js', 'index.js.map']) {
  const p = join(dist, name);
  if (existsSync(p)) {
    unlinkSync(p);
    console.log('Removido:', name);
  }
}
