/**
 * @constructor
 */
function busLayer(layer) {
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
  var objLoader = new THREE.OBJLoader();
  var orangeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffaa00,
    side: THREE.FrontSide
  });
  Loader.loadAjax('res/bus.obj', function(response) {
    that.bus = objLoader.parse(response);
    that.bus.traverse(function(child) {
      child.material = orangeMaterial;
    });
    that.bus.position.set(-3, -1, 90);
    that.bus.scale.set(0.01, 0.01, 0.01);
    that.scene.add(that.bus);
  });

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

busLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

busLayer.prototype.update = function(frame, relativeFrame) {
  if (this.bus) {
    this.bus.rotation.y = relativeFrame / 100;
  }
};
