import { register } from 'module';
import { argv } from 'process';

register('./loader.mjs', import.meta.url, { data: { argv1: argv[1] } });
