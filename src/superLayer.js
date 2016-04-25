/**
 * @constructor
 */
function superLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  this.camera.position.z = 100;

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  var that = this;
  Loader.loadAjax('res/pirate-ship-giant.json', function(response) {
    var loader = new THREE.ObjectLoader();
    that.ship = loader.parse(JSON.parse(response));
    that.ship.position.set(0, -1, 90);
    that.scene.add(that.ship);
  });
}

superLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

superLayer.prototype.start = function() {
};

superLayer.prototype.end = function() {
};

superLayer.prototype.resize = function() {
};

superLayer.prototype.update = function(frame, relativeFrame) {
  if (this.ship) {
    this.ship.rotation.y = relativeFrame / 100;
  }
};
