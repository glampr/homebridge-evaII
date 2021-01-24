import axios from 'axios';
import url from 'url';
import crypto from 'crypto';

export class EvaIIClient {
  APP_KEY = '3742e9e5842d4ad59c2db887e12449f9'
  APP_ID = 1017
  SRC = 17
  SERVER_URL  = 'https://mapp.appsmb.com'
  CLIENT_TYPE = 1                 // Android
  FORMAT      = 2                 // JSON
  LANGUAGE    = 'en_US'

  private sessionId: String = '';

  constructor(
    public readonly account,
    public readonly password
  ) {
  }

  getLoginId() {
    this.makeRequest(
      '/v1/user/login/id/get',
      { loginAccount: this.account },
      (result) => {}
    )
  }

  ensureSession() {}

  makeRequest(endpoint, params = {}, callback) {
    params['appId'] = this.APP_ID;
    params['format'] = this.FORMAT;
    params['clientType'] = this.CLIENT_TYPE;
    params['language'] = this.LANGUAGE;
    params['src'] = this.SRC;
    params['stamp'] = new Date().toISOString().replace(/[T:-]/g, '');
    params['stamp'] = params['stamp'].substring(0, params['stamp'].indexOf('.'));

    if (this.sessionId) params['sessionId'] = this.sessionId;

    params['sign'] = this.sign(endpoint, params);

    axios.post(
      this.SERVER_URL + endpoint,
      new url.URLSearchParams(params).toString()
    )
      .then(function (response) {
        console.log(response);
        if (callback) callback(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  sign(endpoint, params) {
    const urlParams = new url.URLSearchParams(params);
    urlParams.sort();

    return crypto
      .createHash('sha256')
      .update(endpoint + decodeURIComponent(urlParams.toString()) + this.APP_KEY)
      .digest('hex');
  }
}
