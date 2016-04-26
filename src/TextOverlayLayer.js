/**
 * @constructor
 */
function TextOverlayLayer(layer) {
  this.config = layer.config;

  if (!document.getElementById('dropyouranchor-font')) {
    var s = document.createElement('style');
    s.setAttribute('id', 'dropyouranchor-font');
    Loader.loadAjax('res/dropyouranchor.base64', function(response) {
      s.innerHTML = [
        "@font-face {",
          "font-family: 'dropyouranchor';",
          "src: url(data:application/x-font-woff;charset=utf-8;base64," + response + ") format('woff');",
        "}"
      ].join('\n');
    })
    document.body.appendChild(s);
  }

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(16 / -2, 16 / 2, 9 / 2, 9 / -2, 1, 1000);

  this.canvas = document.createElement('canvas');
  this.texture = new THREE.Texture(this.canvas);
  this.resize();
  this.ctx = this.canvas.getContext('2d');

  this.canvasCube = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 1),
    new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true
    })
  );

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.camera.position.z = 100;
  this.scene.add(this.canvasCube);
}

TextOverlayLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

TextOverlayLayer.prototype.start = function() {
};

TextOverlayLayer.prototype.end = function() {
};

TextOverlayLayer.prototype.update = function(frame, relativeFrame) {

  this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);

  var scale = 1 + 0.01 * Math.sin(relativeFrame / 60 / 60 * 100 * Math.PI * 2);

  this.ctx.font = ((GU * 3 / 5 * 0.8 * scale)) + "px dropyouranchor";
  this.ctx.shadowColor = "black";
  this.ctx.shadowOffsetX = 2; 
  this.ctx.shadowOffsetY = 2; 
  this.ctx.shadowBlur = 2;
  var yOffsets = [3.55, 4.55, 5.20, 6.05, 6.70, 7.60, 8.30];
  for(var i = 0; i < this.config.bodies.length; i++) {
    var body = this.config.bodies[i];
    if(relativeFrame >= body.endRelativeFrame || relativeFrame < body.startRelativeFrame) {
      continue;
    }
    var relativeRelativeFrame = relativeFrame - body.startRelativeFrame;
    var counter = relativeRelativeFrame / 3.5 | 0;
    for(var j = 0; j < body.lines.length; j++) {
      var line = body.lines[j];
      if(line.length == 0) {
        continue;
      }
      this.ctx.fillStyle = line.color;
      var cursor = '';
      this.ctx.fillText(line.text.slice(0, Math.max(counter, 0)).toUpperCase() + cursor, 8 * GU, yOffsets[j] * GU);
      counter -= line.text.length;
    }
  }

  this.texture.needsUpdate = true;
};

TextOverlayLayer.prototype.resize = function() {
  this.canvas.width = 16 * GU;
  this.canvas.height = 9 * GU;
}
