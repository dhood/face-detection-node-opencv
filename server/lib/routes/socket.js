var cv = require('opencv');
var useCamera = false;

if(useCamera){
  // camera properties
  var camWidth = 320;
  var camHeight = 240;
  var camFps = 10;
  var camInterval = 1000 / camFps;

  // face detection properties
  var rectColor = [0, 255, 0];
  var rectThickness = 2;

  try {
    // initialize camera
    var camera = new cv.VideoCapture(0);
    camera.setWidth(camWidth);
    camera.setHeight(camHeight);

  } catch (e){
    console.log("Couldn't start camera:", e)
  }
}
else{
  var imagePath = "./files/coin1.jpg"//mona.png";
  cv.readImage(imagePath, function(err, im){
    if (err) throw err;
    if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
    image = im;
  });
}

module.exports = function (socket) {


  if(useCamera){
      setInterval(function() {
    camera.read(function(err, im) {
        if (err) throw err;

        im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
          if (err) throw err;

          for (var i = 0; i < faces.length; i++) {
            face = faces[i];
            im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], rectColor, rectThickness);
          }

          socket.emit('frame', { buffer: im.toBuffer() });
        });
      }); 
         
    }, camInterval);
  } 

  else{
    socket.emit('frame', { buffer: image.toBuffer(), height: image.size()[0], width: image.size()[1]});
  }


};

