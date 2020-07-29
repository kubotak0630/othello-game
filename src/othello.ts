import Board, { StoneColor, Pos } from './board';

export default class Othello {
  private _board: Board;
  private _turn: StoneColor;
  private _cpuColor: StoneColor;

  constructor() {
    this._board = new Board();
    this._turn = 'Black'; //黒が先行
    this._cpuColor = 'White';
  }
  get board() {
    return this._board;
  }

  get turn(): StoneColor {
    return this._turn;
  }

  get cpuColor(): StoneColor {
    return this._cpuColor;
  }

  getTurnColor(): StoneColor {
    return this._turn;
  }

  //ターンを変更して、変更後のターン色を返す
  setChangeTurn(): StoneColor {
    this._turn = this._turn === 'Black' ? 'White' : 'Black';
    return this._turn;
  }

  // Passかどうかを判定。置く場所がない場合にTrue
  isPass(): boolean {
    const putOKCells = this.board.getPutOKCells(this._turn);
    console.log(`${this._turn} OK_Cells ${putOKCells.length}`);
    console.log(putOKCells.length, putOKCells);
    return putOKCells.length === 0;
  }

  private _isBothPass(): boolean {
    const putOKCellsBlack = this.board.getPutOKCells('Black');
    const putOKCellsWhite = this.board.getPutOKCells('White');
    return putOKCellsBlack.length === 0 && putOKCellsWhite.length === 0;
  }

  //盤面が全て埋まっている。または黒白両方で置き場所がないときにTrueを返す
  isGameFinish(): boolean {
    return this._board.isRemainEmptyCell() === 0 || this._isBothPass();
  }

  isCpuTurn(): boolean {
    return this._turn === this._cpuColor;
  }

  //白,黒の石の数を返す
  getResult(): { whiteNum: number; blackNum: number } {
    return this.board.calcResult();
  }

  //min以上max未満のランダムな整数
  private getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //状態を初期化する
  reset(): void {
    this.board.init();
    this._turn = 'Black'; //黒が先行
  }

  cpuAlgor(): Pos | null {
    let putOKCells: Pos[] = this.board.getPutOKCells(this._turn);
    //配列をコピー
    // const copyAry: Pos[] = JSON.parse(JSON.stringify(putOKCells));

    //四隅チェック関数の定義
    const cornerCheck = (posAry: Pos[]): Pos[] => {
      let retPosAry: Pos[] = [];
      for (let elem of posAry) {
        if (elem.x == 0 && elem.y == 0) {
          retPosAry.push({ x: 0, y: 0 });
        } else if (elem.x == 0 && elem.y == 7) {
          retPosAry.push({ x: 0, y: 7 });
        } else if (elem.x == 7 && elem.y == 7) {
          retPosAry.push({ x: 7, y: 7 });
        } else if (elem.x == 7 && elem.y == 0) {
          retPosAry.push({ x: 7, y: 0 });
        }
      }
      return retPosAry;
    };

    if (putOKCells.length) {
      //四隅が打てる場合は優先する
      const cornerAry = cornerCheck(putOKCells);
      if (cornerAry.length !== 0) {
        return cornerAry[0]; //複数あった場合は(0,0)から右回りで優先
      }
      //四隅が打てない場合はランダムで選択
      else {
        return putOKCells[this.getRandomInt(0, putOKCells.length)];
      }
    } else {
      return null;
    }
  }
}
