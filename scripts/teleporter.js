var Teleporter = pc.createScript('teleporter');

Teleporter.attributes.add('target', {
    type: 'entity',
    title: 'Target Entity',
    description: 'The target entity where we are going to teleport'
});

// initialize code called once per entity
Teleporter.prototype.initialize = function() {
    const onTriggerEnter = (otherEntity) => {
        // If the entity entering the trigger has the movement script...
        if (otherEntity.script.movement) {
            // ...teleport that entity to the target entity
            const targetPos = this.target.getPosition().clone();
            targetPos.y += 0.5;
            otherEntity.script.movement.teleport(targetPos);
        }
    };

    // Subscribe to the triggerenter event of this entity's collision component.
    // This will be fired when a rigid body enters this collision volume.
    this.entity.collision.on('triggerenter', onTriggerEnter);

    // And unsubscribe if the teleporter is destroyed
    this.on('destroy', () => {
        this.entity.collision.off('triggerenter', onTriggerEnter);
    });
};
