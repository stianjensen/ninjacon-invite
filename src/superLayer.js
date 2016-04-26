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

  var objLoader = new THREE.OBJLoader();
  var orangeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffaa00,
    side: THREE.DoubleSide
  });
  var tireMaterial = new THREE.MeshPhongMaterial({
    color: 0x222222,
    side: THREE.FrontSide
  });
  Loader.loadAjax('res/shark.obj', function(response) {
    that.shark = objLoader.parse(response);
    that.shark.position.set(0, -1, 90);
    that.shark.scale.set(0.001, 0.001, 0.001);
    that.scene.add(that.shark);
    console.log(that.scene);
  });
  Loader.loadAjax('res/bus.obj', function(response) {
    that.bus = objLoader.parse(response);
    that.bus.traverse(function(child) {
      if (child.name === "Group_001") {
        child.material = orangeMaterial;
      } else {
        child.material = tireMaterial;
      }
    });
    that.bus.position.set(0, -1, 95);
    that.bus.scale.set(0.01, 0.01, 0.01);
    that.scene.add(that.bus);
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
  if (this.shark) {
    this.shark.rotation.y = 1 + relativeFrame / 100;
  }
  if (this.bus) {
    this.bus.rotation.y = 2 + relativeFrame / 100;
  }
};
