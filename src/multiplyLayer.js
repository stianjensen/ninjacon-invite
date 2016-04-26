/**
 * @constructor
 */
function multiplyLayer(layer) {
  this.config = layer.config;
  this.shaderPass = new THREE.ShaderPass(SHADERS.multiply);
  this.shaderPass.uniforms.r.value = 0;
  this.shaderPass.uniforms.g.value = 0;
  this.shaderPass.uniforms.b.value = 0;
}

multiplyLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};

multiplyLayer.prototype.start = function() {
};

multiplyLayer.prototype.end = function() {
};

multiplyLayer.prototype.update = function(frame, relativeFrame) {
  var amount = smoothstep(1, 0, frame / 50);
  if(frame > 2450) {
    amount = smoothstep(0, 1, (frame - 2450) / 70);
  }
  this.shaderPass.uniforms.amount.value = amount;
};

multiplyLayer.prototype.resize = function() {
};
