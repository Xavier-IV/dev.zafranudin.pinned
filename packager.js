const packager = require("@electron/packager");

async function packageApp() {
  try {
    await packager({
      dir: "./",
      out: "./dist", // Output directory for .app
      platform: "darwin",
      arch: "x64",
      osxSign: {}, // Signing options (empty object if you already signed elsewhere)
      icon: "./src/assets/logo.png",
      osxNotarize: {
        teamId: process.env.APPLE_TEAM_ID,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
      },
    });

    console.log(`Packaged .app created.`);
  } catch (error) {
    console.error("Error during packaging:", error);
  }
}

packageApp();
