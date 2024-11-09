// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//

import { webFrame } from "electron";

// Set the zoom factor to 30%
webFrame.setZoomFactor(0.2);

console.log(">> HEllo world");
