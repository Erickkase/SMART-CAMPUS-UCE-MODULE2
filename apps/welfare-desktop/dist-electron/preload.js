"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const API_BASE = `http://localhost:${process.env.EXPRESS_PORT || 3099}`;
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    getApiBaseUrl: () => API_BASE,
});
//# sourceMappingURL=preload.js.map