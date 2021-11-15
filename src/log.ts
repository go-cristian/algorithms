const debug = process.env.NODE_ENV === 'development'
export const log = debug ? console.log : () => {}
