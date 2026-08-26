import * as migration_20260826_112006_initial from './20260826_112006_initial';

export const migrations = [
  {
    up: migration_20260826_112006_initial.up,
    down: migration_20260826_112006_initial.down,
    name: '20260826_112006_initial'
  },
];
