export class SSRRedirectError extends Error {
  constructor() {
    super('SSR_REDIRECT');
    this.name = 'SSRRedirectError';
  }
}
