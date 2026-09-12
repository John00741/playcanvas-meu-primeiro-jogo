var Movement = pc.createScript('movement');

Movement.attributes.add('speed', {
    type: 'number',
    default: 0.1,
    min: 0.05,
    max: 0.5,
    precision: 2,
    description: 'Controls the movement speed'
});

Movement.attributes.add('jumpForce', {
    type: 'number',
    default: 4,
    min: 1,
    max: 10,
    precision: 1,
    description: 'Controls how strong the ball jumps when Space is pressed'
});

Movement.attributes.add('maxJumps', {
    type: 'number',
    default: 2,
    min: 1,
    max: 5,
    precision: 0,
    description: 'How many times the ball can jump before touching the ground again (2 = double jump)'
});

// Initialize code called once per entity
Movement.prototype.initialize = function() {
    this.force = new pc.Vec3();
    this.spawnPos = this.entity.getPosition().clone();

    // Tracks how many surfaces the ball is currently touching, so jumps
    // remaining reset only once it actually lands again.
    this.contactCount = 0;
    this.jumpsUsed = 0;

    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    this.entity.collision.on('collisionend', this.onCollisionEnd, this);
};

Movement.prototype.onCollisionStart = function() {
    // Reset jumps exactly on the landing transition (0 -> 1 contacts).
    // Doing this here instead of every frame in update() avoids a stale
    // contactCount (which can lag a frame or two after leaving the ground)
    // from granting extra jumps beyond maxJumps.
    if (this.contactCount === 0) {
        this.jumpsUsed = 0;
    }
    this.contactCount++;
};

Movement.prototype.onCollisionEnd = function() {
    this.contactCount = Math.max(0, this.contactCount - 1);
};

// Update code called every frame
Movement.prototype.update = function(dt) {
    // If the player falls off a platform, teleport to the last location.
    const pos = this.entity.getPosition();
    if (pos.y < -1) {
        this.teleport(this.spawnPos);
        return;
    }

    const keyboard = this.app.keyboard;
    let forceX = 0;
    let forceZ = 0;

    // Calculate force based on pressed keys
    if (keyboard.isPressed(pc.KEY_LEFT) || keyboard.isPressed(pc.KEY_A)) {
        forceX = -this.speed;
    }

    if (keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D)) {
        forceX += this.speed;
    }

    if (keyboard.isPressed(pc.KEY_UP) || keyboard.isPressed(pc.KEY_W)) {
        forceZ = -this.speed;
    }

    if (keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S)) {
        forceZ += this.speed;
    }

    this.force.set(forceX, 0, forceZ);

    // If we have some non-zero force
    if (this.force.lengthSq() > 0) {

        // Normalize the force vector
        this.force.normalize().scale(this.speed);

        // Apply rotation to the force vector
        const angle = -Math.PI * 0.25; // 45 degrees in radians
        const rx = Math.cos(angle);
        const rz = Math.sin(angle);
        const forceX = this.force.x * rx - this.force.z * rz;
        const forceZ = this.force.z * rx + this.force.x * rz;

        this.force.set(forceX, 0, forceZ);
    }

    // Apply impulse to move the entity
    this.entity.rigidbody.applyImpulse(this.force);

    if (keyboard.wasPressed(pc.KEY_SPACE) && this.jumpsUsed < this.maxJumps) {
        this.entity.rigidbody.linearVelocity = new pc.Vec3(
            this.entity.rigidbody.linearVelocity.x,
            0,
            this.entity.rigidbody.linearVelocity.z
        );
        this.entity.rigidbody.applyImpulse(0, this.jumpForce, 0);
        this.jumpsUsed++;
    }
};

Movement.prototype.teleport = function(pos) {
    // move ball to that point
    this.entity.rigidbody.teleport(pos);
    this.spawnPos.copy(pos);

    // need to reset angular and linear forces
    this.entity.rigidbody.linearVelocity = pc.Vec3.ZERO;
    this.entity.rigidbody.angularVelocity = pc.Vec3.ZERO;
};
