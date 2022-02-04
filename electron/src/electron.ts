import { app, BrowserWindow } from "electron";

const isDev = process.env.NODE_ENV !== "production";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      //   preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");

  isDev && mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
