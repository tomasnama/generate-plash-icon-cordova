var DOMParser = require('xmldom').DOMParser;
var fs = require('fs');
var Jimp = require("jimp");

var sizes = {
    "ldpi": {
        "width": "36",
        "height": "36"
    },
    "mdpi": {
        "width": "48",
        "height": "48"
    },
    "hdpi": {
        "width": "72",
        "height": "72"
    },
    "xhdpi": {
        "width": "96",
        "height": "96"
    },
    "xxhdpi": {
        "width": "144",
        "height": "144"
    },
    "xxxhdpi": {
        "width": "192",
        "height": "192"
    },
    "land-hdpi": {
        "width": "800",
        "height": "480"
    },
    "land-ldpi": {
        "width": "320",
        "height": "240"
    },
    "land-mdpi": {
        "width": "480",
        "height": "320"
    },
    "land-xhdpi": {
        "width": "1280",
        "height": "720"
    },
    "port-hdpi": {
        "width": "480",
        "height": "800"
    },
    "port-ldpi": {
        "width": "240",
        "height": "320"
    },
    "port-mdpi": {
        "width": "320",
        "height": "480"
    },
    "port-xhdpi": {
        "width": "720",
        "height": "1280"
    },
    "StoreLogo": {
        "width": "50",
        "height": "50"
    },
    "Square30x30Logo": {
        "width": "30",
        "height": "30"
    },
    "Square44x44Logo": {
        "width": "44",
        "height": "44"
    },
    "Square70x70Logo": {
        "width": "70",
        "height": "70"
    },
    "Square71x71Logo": {
        "width": "71",
        "height": "71"
    },
    "Square150x150Logo": {
        "width": "150",
        "height": "150"
    },
    "Square310x310Logo": {
        "width": "310",
        "height": "310"
    },
    "Wide310x150Logo": {
        "width": "310",
        "height": "155"
    }
}

const PATH_CONFIG_XML = 'config.xml';
const PATH_ICON = 'icon.png';
const PATH_SPLASH = 'splash.png';
const TYPE_ICON = 'icon';
const TYPE_SPLASH = 'splash';


fs.readFile(PATH_CONFIG_XML, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    } else {
        var doc = new DOMParser().parseFromString(data);
        /* Process icons */
        let elements = doc.getElementsByTagName(TYPE_ICON);
        processElements(elements, TYPE_ICON);

        /* Process splash */
        elements = doc.getElementsByTagName(TYPE_SPLASH);
        processElements(elements, TYPE_SPLASH);
    }
});


function processElements(elements, type) {
    for (i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.hasAttribute('src')) {
            let density = element.getAttribute('density');
            if (density) {
                if (sizes[density]) {
                    let width = sizes[density]['width'];
                    let height = sizes[density]['height'];
                    if (type === TYPE_ICON) {
                        resizeImage(element.getAttribute('src'), width, height);
                    } else if (type === TYPE_SPLASH) {
                        scaleImage(element.getAttribute('src'), width, height);
                    }
                }
            } else if (element.hasAttribute('width') && element.hasAttribute('height')) {
                if (type === TYPE_ICON) {
                    resizeImage(element.getAttribute('src'), element.getAttribute('width'), parseInt(element.getAttribute('height')));
                } else if (type === TYPE_SPLASH) {
                    scaleImage(element.getAttribute('src'), element.getAttribute('width'), parseInt(element.getAttribute('height')));
                }
            } else if (element.hasAttribute('target')) {
                let target = element.getAttribute('target');
                if (target) {
                    if (sizes[target]) {
                        let width = sizes[target]['width'];
                        let height = sizes[target]['height'];
                        if (type === TYPE_ICON) {
                            resizeImage(element.getAttribute('src'), width, height);
                        } else if (type === TYPE_SPLASH) {
                            scaleImage(element.getAttribute('src'), width, height);
                        }
                    }
                }
            }
        }
    }
}


function resizeImage(src, width, height) {
    let _width = parseInt(width);
    let _height = parseInt(height);
    Jimp.read(PATH_ICON).then(function (image) {
        image.resize(_width, _height)             // resize
                .quality(100)                     // set JPEG quality
                .write(src);                      // save
        console.log(src);
    }).catch(function (err) {
        console.error(err);
    });
}

function scaleImage(src, width, height) {
    let _width = parseInt(width);
    let _height = parseInt(height);
    Jimp.read(PATH_SPLASH).then(function (image) {
        image.cover(_width, _height, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)     // scale
                .quality(100)                                                                       // set JPEG quality
                .write(src);                                                                        // save
        console.log(src);
    }).catch(function (err) {
        console.error(err);
    });
}


