var LavaFlow = pc.createScript('lavaFlow');

LavaFlow.attributes.add('flowSpeedX', {
    type: 'number',
    default: 0.05,
    precision: 3,
    description: 'How fast the lava texture scrolls horizontally'
});

LavaFlow.attributes.add('flowSpeedY', {
    type: 'number',
    default: 0.08,
    precision: 3,
    description: 'How fast the lava texture scrolls vertically'
});

LavaFlow.attributes.add('pulseSpeed', {
    type: 'number',
    default: 1.5,
    precision: 2,
    description: 'How fast the glow pulses'
});

LavaFlow.attributes.add('pulseAmount', {
    type: 'number',
    default: 0.5,
    precision: 2,
    description: 'How much the emissive glow intensity varies'
});

LavaFlow.prototype.initialize = function() {
    this.time = 0;
    this.material = this.entity.render.meshInstances[0].material;
    this.baseEmissiveIntensity = this.material.emissiveIntensity;
};

LavaFlow.prototype.update = function(dt) {
    this.time += dt;

    const offset = this.material.emissiveMapOffset;
    offset.set(this.time * this.flowSpeedX, this.time * this.flowSpeedY);
    this.material.emissiveMapOffset = offset;
    this.material.diffuseMapOffset = offset;

    this.material.emissiveIntensity = this.baseEmissiveIntensity +
        Math.sin(this.time * this.pulseSpeed) * this.pulseAmount;

    this.material.update();
};
