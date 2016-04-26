/**
 * @constructor
 */
function BGOverlayLayer(layer) {
  this.config = layer.config;

  this.scene = new THREE.Scene();
  this.camera = new THREE.OrthographicCamera(16 / -2, 16 / 2, 9 / 2, 9 / -2, 1, 1000);
  this.texture = Loader.loadTexture('res/seashark.png');
  this.textureCube = new THREE.Mesh(new THREE.BoxGeometry(16, 9, 1),
    new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true
    })
  );

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
  this.camera.position.z = 100;
  this.scene.add(this.textureCube);
}

BGOverlayLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

BGOverlayLayer.prototype.start = function() {
};

BGOverlayLayer.prototype.end = function() {
};

BGOverlayLayer.prototype.update = function(frame, relativeFrame) {
  if(frame == 2544) {
    demo.jumpToFrame(0);
    return;
  }

  var firstThrob = 1 + 0.005 + 0.005 * Math.sin(relativeFrame / 60 / 60 * 100 * Math.PI * 2 / 4);
  var scaleX = firstThrob;  
  var scaleY = firstThrob;  

  var progress = Math.max((relativeFrame - 1210) / 35, 0);
  scaleX = smoothstep(scaleX, 2, progress);
  scaleY = smoothstep(scaleY, 2, progress);
  var rotationZ = smoothstep(0, -Math.PI / 2, progress - 0.5);
  var positionY = smoothstep(0, -8.2, progress - 1);
  var positionX = smoothstep(0, 0.82, progress - 1);
  var decay = 1;

  if(relativeFrame > 2300) {
    progress = (relativeFrame - 2300) / 200;
    var decayProgress = 0.5 + 0.5 * (relativeFrame - 2300) / 50;
    scaleX = smoothstep(2, 4, progress - 0.25);
    scaleY = smoothstep(2, 4, progress - 0.25);
    rotationZ = smoothstep(-Math.PI / 2, 0, progress - 0.2);
    positionY = smoothstep(-8.2, 0, progress);
    positionX = smoothstep(0.82, -1, progress);
    decay = smoothstep(2, 0, decayProgress);
  }

  if(relativeFrame > 1210 + 35) {
    var bounce = decay * 0.005 * Math.sin(relativeFrame * Math.PI * 2 / 60 / 60 * 128);
    var doubleBounce = decay * 0.005 * Math.sin(relativeFrame * Math.PI * 2 / 60 / 60 * 128 / 2);
    scaleX *= 1 + bounce;
    scaleY *= 1 + bounce;
    positionX += doubleBounce * 20;
  }

  if(BEAN >= 354 && BEAN < 357) {
    rotationZ += 0.05;
    scaleX *= 1.1;
    scaleY *= 1.1;
    positionY -= 1;
  }
  if(BEAN >= 357 && BEAN < 360) {
    rotationZ -= 0.05;
    scaleX *= 1.1;
    scaleY *= 1.1;
    positionY -= 1;
  }

  if(BEAN >= 420 && BEAN < 444) {
    scaleX *= 1.1;
    scaleY *= 1.1;
    positionY *= 1.1;
  }
  this.textureCube.scale.set(scaleX, scaleY, 1);
  this.textureCube.rotation.z = rotationZ;
  this.textureCube.position.x = positionX;
  this.textureCube.position.y = positionY;
};
