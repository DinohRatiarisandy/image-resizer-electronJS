const menuTemplate = require("./menuTemplate");
const ResizeImg = require("resize-img");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");

const isDev = process.env.NODE_DEV !== "production";
const isMac = process.platform == "darwin";

let mainWindow;

// Create the main window
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "Image resizer",
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js')
        }
    });

    // Change the app's icon
    const iconPath = path.join(__dirname, "./assets/app-icon.png");
    mainWindow.setIcon(iconPath);
    
    // The app is in develepment ?
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

// APP is ready ?
app.on("ready", function() {
    createMainWindow();

    // Implement Menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
    
    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on("window-all-closed", function() {
    if (!isMac) {
        app.quit();
    }
});

// Respond to ipcRenderer resize
ipcMain.on("image:resize", function (e, options) {
    options.dest = path.join(os.homedir(), "imageresizer");
    resizeImage(options);
})

// The main function to resize an image
async function resizeImage({ imagePath, width, height, dest }) {
    try {
        const newPath = await ResizeImg(fs.readFileSync(imagePath), {
            width: parseInt(width),
            height: parseInt(height)
        });

        // Create fileName
        const fileName = path.basename(imagePath);

        // Create dest folder if not exists
        if(!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        // Write file do dest
        fs.writeFileSync(path.join(dest, fileName), newPath)

        // Send success to renderer
        mainWindow.webContents.send("image:done");

        // Open dest folder
        shell.openPath(dest);

    } catch (error) {
        console.error(error);
    }
}