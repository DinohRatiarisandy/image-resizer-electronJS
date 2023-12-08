module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: './assets/app-icon.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        setupIcon: './assets/app-icon.png'
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        setupIcon: './assets/app-icon.png'
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {
        setupIcon: './assets/app-icon.png'
      },
    },
  ],
};
