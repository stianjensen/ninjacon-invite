/**
 * @constructor
 */
function laptopLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
  this.camera.position.z = 100;

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.set(10, 50, 130);
  this.scene.add(pointLight);

  var objLoader = new THREE.OBJLoader();
  var that = this;
  Loader.loadAjax('res/laptop.obj', function(response) {
    that.laptop = objLoader.parse(response);
    that.laptop.position.set(0, -1, 90);
    that.laptop.scale.set(0.1, 0.1, 0.1);
    that.laptop.rotation.z = -0.5;
    that.scene.add(that.laptop);
  });

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

laptopLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

laptopLayer.prototype.update = function(frame, relativeFrame) {
  if (this.laptop) {
    this.laptop.rotation.y = relativeFrame / 100;
  }
};
