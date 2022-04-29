import useragent from 'express-useragent';

class UserAgent {
  _agent = {};

  constructor(source = 'unknown') {
    this._agent = useragent.parse(source);
  }

  get isEpiphany() {
    return this._agent.isEpiphany;
  }

  get isDesktop() {
    return this._agent.isDesktop;
  }

  get isWindows() {
    return this._agent.isWindows;
  }

  get isWindowsPhone() {
    return this._agent.isWindowsPhone;
  }

  get isLinux() {
    return this._agent.isLinux;
  }

  get isLinux64() {
    return this._agent.isLinux64;
  }

  get isMac() {
    return this._agent.isMac;
  }

  get isChromeOS() {
    return this._agent.isChromeOS;
  }

  get isBada() {
    return this._agent.isBada;
  }

  get isSamsung() {
    return this._agent.isSamsung;
  }

  get isRaspberry() {
    return this._agent.isRaspberry;
  }

  get isBot() {
    return !!this._agent.isBot;
  }

  get isCurl() {
    return this._agent.isCurl;
  }

  get isAndroidTablet() {
    return this._agent.isAndroidTablet;
  }

  get isWinJs() {
    return this._agent.isWinJs;
  }

  get isKindleFire() {
    return this._agent.isKindleFire;
  }

  get isSilk() {
    return this._agent.isSilk;
  }

  get isCaptive() {
    return this._agent.isCaptive;
  }

  get isSmartTV() {
    return this._agent.isSmartTV;
  }

  get silkAccelerated() {
    return this._agent.silkAccelerated;
  }

  get SilkAccelerated() {
    return this._agent.SilkAccelerated;
  }

  get browser() {
    return this._agent.browser;
  }

  get version() {
    return `${this._agent.version}`;
  }

  get os() {
    return this._agent.os;
  }

  get platform() {
    return this._agent.platform;
  }

  get geoIp() {
    return this._agent.geoIp;
  }

  get source() {
    return this._agent.source;
  }

  get isFacebook() {
    return this._agent.isFacebook;
  }

  get isAmaya() {
    return this._agent.isAmaya;
  }

  get isFlock() {
    return this._agent.isFlock;
  }

  get isSeaMonkey() {
    return this._agent.isSeaMonkey;
  }

  get isOmniWeb() {
    return this._agent.isOmniWeb;
  }

  get isKonqueror() {
    return this._agent.isKonqueror;
  }

  get isChrome() {
    return this._agent.isChrome;
  }

  get isWebkit() {
    return this._agent.isWebkit;
  }

  get isFirefox() {
    return this._agent.isFirefox;
  }

  get isSafari() {
    return this._agent.isSafari;
  }

  get isIECompatibilityMode() {
    return this._agent.isIECompatibilityMode;
  }

  get isEdge() {
    return this._agent.isEdge;
  }

  get isIE() {
    return this._agent.isIE;
  }

  get isOpera() {
    return this._agent.isOpera;
  }

  get isBlackberry() {
    return this._agent.isBlackberry;
  }

  get isMobile() {
    return this._agent.isMobile;
  }

  get isTablet() {
    return this._agent.isTablet;
  }

  get isiPad() {
    return this._agent.isiPad;
  }

  get isiPod() {
    return this._agent.isiPod;
  }

  get isiPhone() {
    return this._agent.isiPhone;
  }

  get isAndroid() {
    return this._agent.isAndroid;
  }

  get isAuthoritative() {
    return this._agent.isAuthoritative;
  }

  get isAlamoFire() {
    return this._agent.isAlamoFire;
  }

  get isPhantomJS() {
    return this._agent.isPhantomJS;
  }
}

const setupUserAgent = ctx => {
  const { header } = ctx.request;
  const source = header['user-agent'];

  if (source) {
    ctx.userAgent = new UserAgent(source);
  }
};

export default setupUserAgent;
