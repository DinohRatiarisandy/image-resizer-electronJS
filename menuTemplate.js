const { app } = require("electron");

const menuTemplate = [
    {
        role: "fileMenu"
    },
    {
        label: "Window",
        submenu: [
            {
                role: "reload"
            }
        ]
    }
];

module.exports = menuTemplate;