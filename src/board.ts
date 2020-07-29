import Cell from './cell';
import { CellState } from './cell';

export type Pos = {
  x: number;
  y: number;
};

export type StoneColor = 'Black' | 'White';

export default class Board {
  static readonly WIDTH = 8;
  static readonly HEIGHT = 8;

  private _cells: Cell[];

  constructor() {
    this._cells = new Array(Board.WIDTH * Board.HEIGHT);
    for (let i = 0; i < Board.WIDTH * Board.HEIGHT; i++) {
      this._cells[i] = new Cell('None', { x: i % Board.WIDTH, y: Math.floor(i / Board.HEIGHT) });
    }
    //盤面の初期化
    this.init();
  }

  //盤面の初期化
  init(): void {
    for (let i = 0; i < Board.WIDTH * Board.HEIGHT; i++) {
      this._cells[i].stone = 'None';
    }
    //真ん中に白,黒を２つ対角線に配置
    this.setStone({ x: 3, y: 3 }, 'White');
    this.setStone({ x: 4, y: 4 }, 'White');
    this.setStone({ x: 4, y: 3 }, 'Black');
    this.setStone({ x: 3, y: 4 }, 'Black');
  }

  setStone(pos: Pos, state: CellState) {
    this._cells[pos.x + Board.WIDTH * pos.y].stone = state;
  }
  getStone(pos: Pos): CellState {
    return this._cells[pos.x + Board.WIDTH * pos.y].stone;
  }

  getCell(pos: Pos): Cell {
    return this._cells[pos.x + Board.WIDTH * pos.y];
  }

  isRemainEmptyCell(): number {
    let emptyNum = 0;
    for (let cell of this._cells) {
      if (cell.stone === 'None') {
        emptyNum++;
      }
    }
    return emptyNum;
  }

  calcResult(): { whiteNum: number; blackNum: number } {
    let whiteNum = 0;
    let blackNum = 0;
    for (let cell of this._cells) {
      if (cell.stone === 'Black') {
        blackNum++;
      } else if (cell.stone === 'White') {
        whiteNum++;
      }
    }
    return { whiteNum, blackNum };
  }

  // 反転可能なCellの配列を返す。配列が０なら石を置くことができないということ
  getReverseCells(pos: Pos, stoneColor: StoneColor): Pos[] {
    let results: Pos[] = [];

    results = this._searchCell(pos, [1, -1], stoneColor); //右上
    Array.prototype.push.apply(results, this._searchCell(pos, [1, 0], stoneColor)); //右
    Array.prototype.push.apply(results, this._searchCell(pos, [1, 1], stoneColor)); //右下
    Array.prototype.push.apply(results, this._searchCell(pos, [0, 1], stoneColor)); //下
    Array.prototype.push.apply(results, this._searchCell(pos, [-1, 1], stoneColor)); //左下
    Array.prototype.push.apply(results, this._searchCell(pos, [-1, 0], stoneColor)); //左
    Array.prototype.push.apply(results, this._searchCell(pos, [-1, -1], stoneColor)); //左上
    Array.prototype.push.apply(results, this._searchCell(pos, [0, -1], stoneColor)); //上
    // console.log(results.length, results);

    return results;
  }

  // 配置可能なセルのリストを返す
  getPutOKCells(stoneColor: StoneColor): Pos[] {
    let results: Pos[] = [];

    for (let cell of this._cells) {
      if (cell.stone === 'None') {
        if (this.getReverseCells(cell.pos, stoneColor).length !== 0) {
          results.push(cell.pos);
        }
      }
    }

    return results;
  }

  private _searchCell(pos: Pos, dir: number[], stoneColor: StoneColor): Pos[] {
    let results: Pos[] = [];

    //探索コアの再帰関数を定義
    const _searchCellCore = (pos: Pos, dir: number[], stoneColor: StoneColor, result: Pos[]) => {
      const targetPos: Pos = { x: pos.x + dir[0], y: pos.y + dir[1] };

      //板の外
      if (
        targetPos.x < 0 ||
        targetPos.x >= Board.WIDTH ||
        targetPos.y < 0 ||
        targetPos.y >= Board.HEIGHT
      ) {
        result.length = 0; //配列を空にする
        return;
      }

      const stone: CellState = this.getStone(targetPos);
      if (stone === 'None') {
        result.length = 0; //配列を空にする
        return;
      }
      //同じ色だったらこれまでの結果で終了
      else if (stone == stoneColor) {
        return;
      }
      //違う色はresultに格納して更に探索
      else if (stone != stoneColor) {
        result.push(targetPos);
      }

      _searchCellCore(targetPos, dir, stoneColor, result);
    };

    //探索の再帰関数をコール
    _searchCellCore(pos, dir, stoneColor, results);

    return results;
  }
}
