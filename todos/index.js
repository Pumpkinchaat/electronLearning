const electron = require("electron");
const {app , BrowserWindow , Menu , ipcMain} = electron;

let mainWindow , addWindow;

app.on("ready" , () => {
    console.log("[INFO] App is ready...");
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL(`file:///${__dirname}\\main.html`);
    mainWindow.on("closed" , () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function addNewWindow() {
    addWindow = new BrowserWindow({
        height: 200,
        width: 300,
        title: 'New TODO',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    addWindow.loadURL(`file:///${__dirname}\\add.html`);
    addWindow.on("closed" , () => addWindow = null);
}

const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "New Todo",
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
                click() {
                    addNewWindow();
                }
            },
            {
                label: "Quit",
                accelerator: process.platform === 'darwin'? 'Command+Q' : 'Ctrl+Q',
                click() {
                    console.log("Quitting the application");
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') menuTemplate.unshift({});
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: "DEVELOPER!!!!!",
        submenu: [
            {
                label: "Toggle Dev Tools",
                accelerator: process.platform === 'darwin'? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click (item , focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
};

ipcMain.on("todo:add" , (evt, newTodo) => {
    mainWindow.webContents.send("todo:add" , newTodo);
    addWindow.close();
})