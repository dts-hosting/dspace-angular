import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Request,
  Response,
} from 'express';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import {
  REQUEST,
  RESPONSE,
} from '../../../express.tokens';
import { isNotEmpty } from '../../shared/empty.util';
import { HardRedirectService } from './hard-redirect.service';
import { SSRRedirectError } from '../errors/ssr-redirect-error';

/**
 * Service for performing hard redirects within the server app module
 */
@Injectable()
export class ServerHardRedirectService extends HardRedirectService {

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    @Inject(REQUEST) protected req: Request,
    @Inject(RESPONSE) protected res: Response,
  ) {
    super();
  }

  /**
   * Perform a hard redirect to a given location.
   *
   * @param url
   *    the page to redirect to
   * @param statusCode
   *    optional HTTP status code to use for redirect (default = 302, which is a temporary redirect)
   */
  redirect(url: string, statusCode?: number): Promise<never> {
    if (url === this.req.url) {
      return;
    }

    let redirectUrl = url;
    // If redirect url contains SSR base url then replace with public base url
    if (isNotEmpty(this.appConfig.rest.ssrBaseUrl) && this.appConfig.rest.baseUrl !== this.appConfig.rest.ssrBaseUrl) {
      redirectUrl = url.replace(this.appConfig.rest.ssrBaseUrl, this.appConfig.rest.baseUrl);
    }

    // Attempt to use passed in statusCode or the already set status (in request)
    let status = statusCode || this.res.statusCode || 0;
    if (status < 300 || status >= 400) {
      // temporary redirect
      status = 302;
    }

    console.info(`Redirecting from ${this.req.url} to ${redirectUrl} with ${status}`);

    if (!this.res.headersSent && !this.res.finished) {
      this.res.status(status);
      this.res.location(redirectUrl);
    }

    // Throw to halt Angular rendering
    return Promise.reject(new SSRRedirectError());
  }

  /**
   * Get the URL of the current route
   */
  getCurrentRoute(): string {
    return this.req.originalUrl;
  }

  /**
   * Get the origin of the current URL
   * i.e. <scheme> "://" <hostname> [ ":" <port> ]
   * e.g. if the URL is https://demo.dspace.org/search?query=test,
   * the origin would be https://demo.dspace.org
   */
  getCurrentOrigin(): string {
    return this.req.protocol + '://' + this.req.headers.host;
  }
}
