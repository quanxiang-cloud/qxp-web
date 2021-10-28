export const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
export const isProduction = NODE_ENV === 'production';
