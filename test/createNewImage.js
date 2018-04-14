var fs = require('fs');
var proxyquire = require('proxyquire');
var test = require('tape');

const opts = { timeout: 30000 }

test('creates a gif and tries to upload it', opts , async function (t) {
    
    var imgurUploaderStub = function() {
    	return { link: 'https://i.imgur.com/' }
    }

    var createNewImage = proxyquire('../createNewImage', {
    	'imgur-uploader': imgurUploaderStub
    })

    var glitterUrl = await createNewImage("Tuesday");
    // Verify file creation
    t.true(fs.existsSync('glitter.gif'));
    // Verify the file was passed to imgurUploader
    t.equal(glitterUrl, 'https://i.imgur.com/');
    t.end();
});
