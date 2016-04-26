/*
 * @constructor
 */
function BloomLayer(layer) {
  this.config = layer.config;
  this.amount = this.config.amount;
  this.noStabs = !!this.config.noStabs;
  this.shaderPass = new THREE.BloomPass(this.amount, 16, 160, 512);
  this.stab = 0;
}

BloomLayer.prototype.update = function(frame) {

  this.stab *= 0.9;
  if(this.stab < 0.1) {
    this.stab = 0;
  }
  if(BEAT && BEAN % 6 == 0) {
    this.stab = 1;
  }

  var multiplier = 1;
  if(frame > 1250) {
    multiplier += (this.noStabs ? 1 : this.stab) * 0.4 - 0.2;
  }

  this.shaderPass.copyUniforms.opacity.value = this.amount * multiplier;
};

BloomLayer.prototype.getEffectComposerPass = function() {
  return this.shaderPass;
};
