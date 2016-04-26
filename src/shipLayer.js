/**
 * @constructor
 */
function shipLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.camera.position.z = 100;

  var light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.set( -50, -50, -50 );
  this.scene.add(light);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  this.scene.add(pointLight);

  var that = this;
  Loader.loadAjax('res/pirate-ship-giant.json', function(response) {
    var loader = new THREE.ObjectLoader();
    that.ship = loader.parse(JSON.parse(response));
    that.ship.scale.set(15, 15, 15);
    that.ship.position.set(-65, -5, -100);
    //that.scene.add(that.ship);
  });

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

shipLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

shipLayer.prototype.update = function(frame, relativeFrame) {
  if (this.ship) {
    this.ship.rotation.y = relativeFrame / 100;
  }
};
