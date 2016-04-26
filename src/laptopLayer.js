/**
 * @constructor
 */
function laptopLayer(layer) {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera(65, 16 / 9, 1, 10000);
  this.camera.position.z = 100;

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.set(10, 50, 130);
  this.scene.add(pointLight);

  var objLoader = new THREE.OBJLoader();
  var mtlLoader = new THREE.MTLLoader();
  var that = this;
  Loader.loadAjax('res/laptop.obj', function(response) {
    that.laptop = objLoader.parse(response);
    that.laptop.position.set(0, -10, 0);
    var scale = 3;
    that.laptop.scale.set(scale, scale, scale);
    that.laptop.rotation.z = -0.5;
    that.scene.add(that.laptop);
  });
  Loader.loadAjax('res/Sunglasses.obj', function(response) {
    that.sunglasses = objLoader.parse(response);
    var scale = 0.2;
    that.sunglasses.scale.set(scale, scale, scale);
    that.sunglasses.position.set(0, 2, 0);
    that.scene.add(that.sunglasses);
  });
  var bottleContainer = {};
  Loader.loadAjax('res/bottle.mtl', function(response) {
    bottleContainer.mtl = response;
    if (bottleContainer.obj) {
      finishBottleLoading(bottleContainer);
    }
  });
  Loader.loadAjax('res/bottle.obj', function(response) {
    bottleContainer.obj = response;
    if (bottleContainer.mtl) {
      finishBottleLoading(bottleContainer);
    }
  });

  function finishBottleLoading(bottleContainer) {
    var bottleMaterialCreator = mtlLoader.parse(bottleContainer.mtl);
    bottleMaterialCreator.preload();

    objLoader.setMaterials(bottleMaterialCreator);
    that.bottle = objLoader.parse(bottleContainer.obj);
    var scale = 2;
    that.bottle.scale.set(scale, scale, scale);
    that.bottle.position.set(0, -20, 0);
    that.scene.add(that.bottle);
  }

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);
}

laptopLayer.prototype.getEffectComposerPass = function() {
  return this.renderPass;
};

laptopLayer.prototype.update = function(frame, relativeFrame) {
  if (this.laptop) {
    var relrelframe = relativeFrame - 200;
    var speedup = smoothstep(0.1, 4, relrelframe / 200);
    this.laptop.position.x = smoothstep(200, 0, relrelframe / 100);
    this.laptop.rotation.y = relrelframe / 100 + speedup * relrelframe / 100;
    if(relrelframe > 250) {
      this.laptop.position.x = smoothstep(0, -200, (relrelframe - 250) / 100);
    }
  }
  if(this.sunglasses) {
    var relrelframe = relativeFrame - 430;
    var speedup = smoothstep(0.1, 4, relrelframe / 200);
    this.sunglasses.position.x = smoothstep(200, -10, relrelframe / 100);
    this.sunglasses.rotation.x = 0.1 * Math.sin(relrelframe / 100 + speedup * relrelframe / 100);
    this.sunglasses.rotation.z = 0.1 * Math.sin(relrelframe / 100 + speedup * relrelframe / 100);
    if(relrelframe > 250) {
      this.sunglasses.position.x = smoothstep(-10, -200, (relrelframe - 250) / 100);
    }
  }
  if(this.bottle) {
    var relrelframe = relativeFrame - 480;
    var speedup = smoothstep(0.1, 4, relrelframe / 200);
    this.bottle.position.x = smoothstep(200, -10, relrelframe / 100);
    this.bottle.rotation.y =  0.3 * Math.sin(relrelframe / 100 + speedup * relrelframe / 100);
    this.bottle.rotation.x = -Math.PI/2;// + 0.1 * Math.sin(relrelframe / 100 + speedup * relrelframe / 100);
    if(relrelframe > 250) {
      this.bottle.position.x = smoothstep(-10, -200, (relrelframe - 250) / 100);
    }
  }
};
