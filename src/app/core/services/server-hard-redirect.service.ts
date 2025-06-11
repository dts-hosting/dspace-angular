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
  redirect(url: string, statusCode?: number) {
      // NO-OP: Do not perform actual HTTP redirect on the server
      console.log(`[SSR] Skipping hard redirect to: ${url}`);
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
