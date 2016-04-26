/**
 * @constructor
 */
function sharkLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.camera.position.z = 100;

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.set(10, 50, 130);
  this.scene.add(pointLight);

  var objLoader = new THREE.OBJLoader();
  var that = this;
  Loader.loadAjax('res/shark.obj', function(response) {
    that.shark = objLoader.parse(response);
    that.shark.position.set(0, -3, 70);
    that.shark.scale.set(0.005, 0.005, 0.005);
    that.scene.add(that.shark);
  });

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

sharkLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

sharkLayer.prototype.update = function(frame, relativeFrame) {
  if (this.shark) {
    this.shark.rotation.y = relativeFrame / 100;
  }
};
