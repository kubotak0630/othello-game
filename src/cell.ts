import { Pos } from './board';

export type CellState = 'Black' | 'White' | 'None';

export default class Cell {
  private _state: CellState;
  private _pos: Pos; //初期化時に配置座標を記憶しておく

  constructor(state: CellState, pos: Pos) {
    this._state = state;
    this._pos = pos;
  }

  set stone(state: CellState) {
    this._state = state;
  }

  get stone(): CellState {
    return this._state;
  }
  get pos(): Pos {
    return this._pos;
  }
}
