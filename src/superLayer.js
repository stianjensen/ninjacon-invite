/**
 * @constructor
 */
function superLayer(layer) {
  this.config = layer.config;
  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(65, 16 / 9, 1, 3000000);

  var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
  light.position.set( 500, 300, 500 );
  this.light = light;
  this.scene.add(light);

  this.scene.add(new THREE.AmbientLight(0x404040));


  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;
  //this.scene.add(pointLight);

  this.cameraLookAt = new THREE.Vector3(0, 20, 0);

  this.camera.position.z = 250;
  this.camera.position.y = 50;
  this.camera.lookAt(this.cameraLookAt);

  this.renderPass = new THREE.RenderPass(this.scene, this.camera);

  this.renderPass.render2 = this.renderPass.render;
  var that = this;
  this.renderPass.render = function(renderer, writeBuffer, readBuffer, delta) {
    that.water.renderer = renderer;
    that.water.render();
    this.render2(renderer, writeBuffer, readBuffer, delta);
  };

  var that = this;
  Loader.loadAjax('res/pirate-ship-giant.json', function(response) {
    var loader = new THREE.ObjectLoader();
    that.ship = loader.parse(JSON.parse(response));
    that.ship.scale.set(20, 20, 20);
    that.scene.add(that.ship);
  });

  var names = [
      'res/px.jpg',
      'res/nx.jpg',
      'res/py.jpg',
      'res/ny.jpg',
      'res/pz.jpg',
      'res/nz.jpg'
  ];
  var skyGeometry = new THREE.BoxGeometry(1000000, 1000000, 1000000);

  var materialArray = [];
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial({
      map: Loader.loadTexture(names[i]),
      side: THREE.BackSide
    }));
  }
  var skyMaterial = new THREE.MeshFaceMaterial(materialArray);
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  this.scene.add(skyBox);

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
    //that.scene.add(that.shark);
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
    //that.scene.add(that.bus);
  });
  var waterNormals = Loader.loadTexture('res/waternormals.jpg');
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
  this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
    textureWidth: 512, 
    textureHeight: 512,
    alpha:  1.0,
    waterNormals: waterNormals,  
    sunDirection: light.position.normalize(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 50.0
  });
  var waterMesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50000, 50000, 10, 10), 
    this.water.material);
  waterMesh.add(this.water);
  waterMesh.rotation.x = - Math.PI * 0.5;
  this.scene.add(waterMesh);


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
  this.water.material.uniforms.time.value = frame / 60;
  var speedUp = smoothstep(0, 0.01, (frame - 1200) / 100);
  this.camera.position.x = 200 * Math.sin(frame / 1000 + (frame - 1200) * speedUp);
  this.camera.position.z = 200 * Math.cos(frame / 1000 + (frame - 1200) * speedUp);
  this.camera.lookAt(this.cameraLookAt);

  if(BEAT && BEAN % 6 == 0) {
    this.light.intensity = 1;
  }
  this.light.intensity *= 0.99;
  if(frame < 1250) {
    this.light.intensity = 1;
  }
  this.water.sunColor.setRGB(this.light.intensity, this.light.intensity, this.light.intensity);
  if (this.ship) {
    this.ship.rotation.y = relativeFrame / 500;
  }
  if (this.shark) {
    this.shark.rotation.y = 1 + relativeFrame / 100;
  }
  if (this.bus) {
    this.bus.rotation.y = 2 + relativeFrame / 100;
  }
};
