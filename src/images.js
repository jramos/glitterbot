const fs = require("fs");
const md5File = require("md5-file");

// Settings
const imageFolder = "./public/";
const langFolders = ["ja/", "nl/"];
const subFolders = ["generic", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const outputFileName = "images.json";

// Object we're going to fill
let images = {};

// Foreach all subfolders
for (const langFolder of langFolders) {
  for (const subFolder of subFolders) {
    // This will add the images to the global object
    readdir(langFolder+subFolder).then(images => {
      // If the keys are equal to the given subfolders, we're done.
      if (Object.keys(images).length == subFolders.length) {
        // Write the object to a file
        fs.writeFile(
          imageFolder + langFolder + outputFileName,
          JSON.stringify(images, null, 4),
          err => {
            if (err) throw err;

            // Notify the user we're done
            console.log(`${langFolder}images.json saved`);
          }
        );
        images = {};
      }
    });
  }
}

function readdir(subFolder) {
  return new Promise(resolve => {
    // Read the subfolder
    fs.readdir(`${imageFolder}${subFolder}`, (err, files) => {
      files.forEach(file => {
        // Images must match one of these extentions
        if (file.match(/\.((?:gif|jpg|jpeg|png))(?:[?#]|$)/i)) {
          // Get the MD5 sum of the image
          const hash = md5File.sync(`${imageFolder}${subFolder}/${file}`);
          fs.rename(
            `${imageFolder}${subFolder}/${file}`,
            `${imageFolder}${subFolder}/${hash}.${file.split(".").pop()}`,
            function(err) {
              if (err) console.log("ERROR: " + err);
            }
          );

          // When the key in the global object doesn't exist yet,
          // create it as a new array
          images[subFolder] = images[subFolder] || [];

          // Add image to given key
          images[subFolder].push(file);
        }
      });

      // Resolve with the image object
      resolve(images);
    });
  });
}
