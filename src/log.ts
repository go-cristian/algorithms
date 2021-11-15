/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
const debug = process.env.NODE_ENV === 'development'
export const log = debug ? console.log : () => {}
