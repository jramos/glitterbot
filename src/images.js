const fs = require("fs");
const md5File = require("md5-file");

// Settings
const imageFolder = "./public/";
const langFolders = ["en/", "nl/"];
const subFolders = ["generic", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const outputFileName = "images.json";

// Foreach all subfolders
for (const langFolder of langFolders) {
  // Object we're going to fill
  let images = {};

  for (const subFolder of subFolders) {
    // This will add the images to the global object
    readdir(langFolder+subFolder, images).then(results => {
      // If the keys are equal to the given subfolders, we're done.
      if (Object.keys(results).length === subFolders.length) {
        // Sort
        const ordered = {};
        Object.keys(results).sort().forEach(function(key) {
          ordered[key] = results[key];
        });
        // Write the object to a file
        fs.writeFile(
          imageFolder + langFolder + outputFileName,
          JSON.stringify(ordered, null, 4),
          err => {
            if (err) throw err;
            images = {};

            // Notify the user we're done
            console.log(`${langFolder}images.json saved`);
          }
        );
      }
    });
  }
}

function readdir(subFolder, images) {
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
          const key = subFolder.split("/")[1];
          images[key] = images[key] || [];

          // Add image to given key
          images[key].push(file);
        }
      });

      // Resolve with the image object
      resolve(images);
    });
  });
}
