const Blueprint = require('factorio-blueprint');

module.exports = function(bp, {x, y}, highY, {LOCOMOTIVES, TRACK_CONCRETE, SINGLE_HEADED_TRAIN, WALLS_ENABLED, WALL_SPACE, WALL_THICKNESS, INCLUDE_RADAR}) {

  const yPosition = y - LOCOMOTIVES*7;
  const xPosition = x;
  
  const trainStopLocation = { x: xPosition + 2, y: yPosition };
  bp.createEntity('train_stop', trainStopLocation, Blueprint.UP);
  for (let i = 0; i <= highY - trainStopLocation.y + WALL_SPACE + (WALLS_ENABLED ? WALL_THICKNESS : 0) + 1; i += 2) {
    bp.createEntity('straight_rail', { x: xPosition, y: yPosition + i }, Blueprint.DOWN);
    // Concrete
    if (TRACK_CONCRETE) {
      const UPPER_Y = highY - trainStopLocation.y + WALL_SPACE + (WALLS_ENABLED ? WALL_THICKNESS : 0)
      for (let xOffset = -1; xOffset <= 2; xOffset++) {
        for (let yOffset = -1; yOffset <= 2; yOffset++) {
          if (yPosition + i + yOffset > UPPER_Y) continue;
          bp.createTile(TRACK_CONCRETE, { x: xPosition + xOffset, y: yPosition + i + yOffset });
        }
      }
    }
  }
  if (SINGLE_HEADED_TRAIN) {
    const LOWER_Y = Math.min(INCLUDE_RADAR ? -3 : 0, trainStopLocation.y - (SINGLE_HEADED_TRAIN ? Math.max(0, trainStopLocation.y) : 0)) - 1;
    for (let i = 2; i < Math.max(0, yPosition - LOWER_Y) + WALL_SPACE + 1 + WALL_THICKNESS; i += 2) {
      bp.createEntity('straight_rail', { x: xPosition, y: yPosition - i }, Blueprint.DOWN);
      // Concrete
      if (TRACK_CONCRETE) {
        for (let xOffset = -1; xOffset <= 1; xOffset++) {
          for (let yOffset = -1; yOffset <= 1; yOffset++) {
            if (yPosition - i + yOffset < LOWER_Y - WALL_SPACE) continue;
            bp.createTile(TRACK_CONCRETE, { x: xPosition + xOffset, y: yPosition - i + yOffset });
          }
        }
      }
    }
  }

  return trainStopLocation;
}