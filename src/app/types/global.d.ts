// src/app/types/global.d.ts

import type { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}
