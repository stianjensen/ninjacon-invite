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

  var partialCubeResources = [
      {image: new Image(), src: 'res/px.jpg'},
      {image: new Image(), src: 'res/nx.jpg'},
      {image: new Image(), src: 'res/py.jpg'},
      {image: new Image(), src: 'res/ny.jpg'},
      {image: new Image(), src: 'res/pz.jpg'},
      {image: new Image(), src: 'res/nz.jpg'}
  ];
  var loadedCount = 0;
  var cubemap = new THREE.CubeTexture(partialCubeResources.map(function(item) {return item.image;}));
  for(var i = 0; i < partialCubeResources.length; i++) {
    Loader.load(partialCubeResources[i].src, partialCubeResources[i].image, function() {
      loadedCount++;
      if(loadedCount == 6) {
        cubemap.needsUpdate = true;
      }
    });
  }

  this.discoball = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 4),
    new THREE.MeshStandardMaterial({
      shading: THREE.FlatShading,
      metalness: 1,
      roughness: 0.2,
      emissive: 0x222222,
      envMap: cubemap
    }));
  this.scene.add(this.discoball);
  var scale = 50;
  this.discoball.scale.set(scale, scale, scale);
  this.discoball.position.set(0, 10, 0);

  var displacementMap = document.createElement('canvas');
  displacementMap.width = 1024;
  displacementMap.height = 1024;
  var displacementMapCtx = displacementMap.getContext('2d');
  var imageData = displacementMapCtx.getImageData(0, 0, 1024, 1024);
  var discorandom = Random('disco');
  var offset = 0;
  for(var i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = offset + discorandom() * (255 - offset) | 0;
    imageData.data[i + 1] = offset + discorandom() * (255 - offset) | 0;
    imageData.data[i + 2] = offset + discorandom() * (255 - offset) | 0;
    imageData.data[i + 3] = 255;
  }
  displacementMapCtx.putImageData(imageData, 0, 0);
  var displacementMapTexture = new THREE.Texture(displacementMap);
  displacementMapTexture.needsUpdate = true;
  this.discoballrays = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 5),
    new THREE.MeshStandardMaterial({
      shading: THREE.SmoothShading,
      metalness: 0,
      roughness: 1,
      emissive: 0xffffff,
      displacementMap: displacementMapTexture,
      displacementScale: 3,
      transparent: true,
      opacity: 0.01,
      alphaMap: displacementMapTexture
    }));
  this.scene.add(this.discoballrays);
  var scale = 50;
  this.discoballrays.scale.set(scale, scale, scale);
  this.discoballrays.position.set(0, 10, 0);


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

  var skyGeometry = new THREE.BoxGeometry(1000000, 1000000, 1000000);

  var cubeShader = THREE.ShaderLib.cube;
  var cubeUniforms = THREE.UniformsUtils.clone(cubeShader.uniforms);
  cubeUniforms.tCube.texture = cubemap;
  var skyMaterial = new THREE.ShaderMaterial({
    fragmentShader: cubeShader.fragmentShader,
    vertexShader: cubeShader.vertexShader,
    uniforms: cubeUniforms,
    side: THREE.BackSide
  });
          
  var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
  this.scene.add(skyBox);

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

  this.discoball.position.y = smoothstep(-100, 100, (relativeFrame - 1200) / 200);
  this.discoball.rotation.z = relativeFrame / 170;

  this.discoballrays.position.copy(this.discoball.position);
  this.discoballrays.rotation.copy(this.discoball.rotation);

  if(BEAT && BEAN % 6 == 0) {
    this.light.intensity = 1;
  }
  this.light.intensity *= 0.99;
  if(frame < 1250) {
    this.light.intensity = 1;
  }
  this.water.sunColor.setRGB(this.light.intensity, this.light.intensity, this.light.intensity);
  this.discoballrays.material.opacity = Math.pow(this.light.intensity * 0.4, 4);
  if(frame <= 1300) {
    this.scene.remove(this.discoballrays);
  } else {
    this.scene.add(this.discoballrays);
  }

  if(BEAN >= 420 && BEAN < 444) {
    this.camera.fov = 35;
  } else {
    this.camera.fov = 65;
  }
  this.camera.updateProjectionMatrix();

};
