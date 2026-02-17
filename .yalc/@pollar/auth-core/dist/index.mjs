// src/client.ts
var STORAGE_KEY = "pollar_session";
var PollarClient = class {
  constructor(config) {
    this._listeners = /* @__PURE__ */ new Set();
    this.config = config;
    this.id = crypto.randomUUID();
    this.basePath = `${config.baseUrl}/v1`;
    this._session = this._readStorage();
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) {
        this._session = this._readStorage();
      }
    });
  }
  getSession() {
    return this._session;
  }
  onSessionChange(cb) {
    this._listeners.add(cb);
    return () => this._listeners.delete(cb);
  }
  async logout() {
    if (!this._session) return;
    await this._fetch("/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: this._session.token.refreshToken })
    });
    this._clearSession();
  }
  async login(options) {
    const url = new URL(`${this.basePath}/auth/${options.provider}`);
    url.searchParams.set("api_key", this.config.apiKey);
    url.searchParams.set("client_token", this.id);
    url.searchParams.set("redirect_uri", window.location.origin);
    switch (options.provider) {
      case "email": {
        url.searchParams.set("email", options.email);
        break;
      }
      case "google": {
        break;
      }
      case "github": {
        throw new Error("GitHub login not implemented yet");
      }
    }
    const popup = window.open(url.toString(), "_blank");
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    });
    const res = await this._fetch(`/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientToken: this.id })
    });
    if (!res.ok) throw new Error("Login failed");
    const session = await res.json();
    console.log({ session });
    this._storeSession(session);
  }
  _readStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (!this._isValidSession(session)) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      if (session.token.expiresAt < Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
  _isValidSession(value) {
    if (typeof value !== "object" || value === null) return false;
    const s = value;
    const user = s["user"];
    if (typeof user !== "object" || user === null) return false;
    const u = user;
    if (typeof u["id"] !== "string" || u["id"] === "") return false;
    if (typeof u["address"] !== "string" || u["address"] === "") return false;
    const token = s["token"];
    if (typeof token !== "object" || token === null) return false;
    const t = token;
    if (typeof t["accessToken"] !== "string" || t["accessToken"] === "") return false;
    if (typeof t["refreshToken"] !== "string" || t["refreshToken"] === "") return false;
    if (typeof t["expiresAt"] !== "number" || !Number.isFinite(t["expiresAt"])) return false;
    return true;
  }
  _storeSession(session) {
    this._session = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this._notify();
  }
  _clearSession() {
    this._session = null;
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  }
  _notify() {
    for (const cb of this._listeners) cb(this._session);
  }
  _fetch(path, init = {}) {
    return globalThis.fetch(`${this.basePath}${path}`, {
      ...init,
      headers: {
        "x-polo-api-key": this.config.apiKey,
        ...init.headers
      }
    });
  }
};

// src/login.ts
async function login(_client, _credentials) {
  throw new Error("Not implemented");
}

// src/logout.ts
async function logout(_client) {
  throw new Error("Not implemented");
}

// src/tokens.ts
async function refreshToken(_client, _token) {
  throw new Error("Not implemented");
}
function getSession(_client) {
  return null;
}

export { PollarClient, getSession, login, logout, refreshToken };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map