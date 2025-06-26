export const enum AnimationState {
  IDLE = 0,
  JUMP = 1,
  WALK = 2,
}

export interface IPosition {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}
