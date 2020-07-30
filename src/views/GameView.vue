<template>
  <div id="scale-wrraper2">
    <div class="scale-wrraper">
      <div class="game-wrraper">
        <div class="button-container">
          <el-button type="primary" class="menu-button" @click="onTitleButtonClick">タイトルに戻る</el-button>
          <el-button type="primary" class="reset-button" @click="onResetButtonClick">リセット</el-button>
        </div>
        <div class="cpu-info">
          CPU {{ cpuAttackOrder }}
          <span class="stone-info">
            <span :class="{ 'black-stone': isCpuBlack, 'white-stone': !isCpuBlack, stone: true }"></span>
            X {{ cpuStonesNum }}
          </span>
        </div>
        <Borad :board="othello.board" :nowloading="nowloading" @emit-cell-click2="onCellClick"></Borad>
        <div class="player-info">
          You {{ playerAttackOrder }} {{ playerInfoStr }}
          <span class="stone-info">
            <span :class="{ 'black-stone': !isCpuBlack, 'white-stone': isCpuBlack, stone: true }"></span>
            X {{ plyerStonesNum }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Borad from '../components/VBoard.vue';
import Othello from '../othello';
import { Pos, StoneColor } from '../board';

type DataType = {
  othello: Othello;
  nowloading: boolean;
  changeTurnFlg: boolean;
  gameEndFlg: boolean;
  resetFlg: boolean;
};

let waitTime = (msec: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};

export default Vue.extend({
  name: 'GameView',
  components: {
    Borad,
  },
  data(): DataType {
    return {
      othello: new Othello(),
      nowloading: false,
      //値に意味はない。ターン変更時(setChangeTurn)でフラグを反転させる。watchイベントをコールするための変数
      changeTurnFlg: false,
      gameEndFlg: false,
      resetFlg: false,
    };
  },
  created() {
    //CPUが先行のときのためにchangeTurnFlgを変化させwatchイベントを呼ぶ
    this.changeTurnFlg = !this.changeTurnFlg;
  },
  mounted() {
    console.log('--- Call mounted ----');
    let deviceWidth = document.documentElement.clientWidth;
    console.log(deviceWidth);
    let scaleX = deviceWidth / 375;
    if (scaleX > 1.5) {
      scaleX = 1.5;
    }
    //iphone5sがdevice_width.x =320 なのでこの場合は0.85333
    else if (scaleX < 0.85) {
      scaleX = 0.8;
    }
    document.getElementById('scale-wrraper2')!.style.transform = `scale(${scaleX})`;
  },
  destroyed() {
    console.log('--- Call destroyed ----');
  },
  methods: {
    //Promiseを返す
    _reverseStone(cellPos: Pos, color: StoneColor) {
      return new Promise((resolve) => {
        // this.$nextTick(() => {
        //石をひっくり返すのにCSSで1sかけているため時間を待つ
        setTimeout(() => {
          this.othello.board.setStone(cellPos, color);
          resolve();
        }, 500);
        // });
      });
    },
    // 石を一つづつひっくり返す
    async reverseStonesAsync(cells: Pos[], color: StoneColor) {
      // 石をひっくり返す;
      for (let elem of cells) {
        await this._reverseStone(elem, color);
      }
      // return 'finish';
      return; //asyn関数はプロミスを返す　このreturnは書かなくてもいい
    },
    async onCellClick(cellPos: Pos) {
      // console.log(cellPos.x, cellPos.y);

      let color = this.othello.getTurnColor();

      //反転するCellを取得
      let reverseCells = this.othello.board.getReverseCells(cellPos, color);
      console.log(reverseCells.length, reverseCells);

      if (reverseCells.length !== 0) {
        //ここで確定する
        this.nowloading = true;

        //石をおく
        this.othello.board.setStone(cellPos, color);

        //石を一つづつひっくり返す
        await this.reverseStonesAsync(reverseCells, color);
        // console.log('finish reverseStonesAsync');
        //引っくり返す処理が完了した後の処理
        console.log('RemainCellNum:', this.othello.board.isRemainEmptyCell());

        // Game終了判断
        if (this.othello.isGameFinish()) {
          this.gameEndFlg = true;
          return;
        }

        //0.7待つ(調整)
        await waitTime(700);

        //Turnを変更
        console.log('--- Trun Change ----');
        this.othello.setChangeTurn();
        this.changeTurnFlg = !this.changeTurnFlg;
      }
    },
    init(): void {
      console.log('Execute Reset');
      this.othello.reset();
      this.nowloading = false;
      this.changeTurnFlg = false;
      this.gameEndFlg = false;
      this.nowloading = false;
    },
    onResetButtonClick() {
      //動作中はリセットフラグを立てるだけ
      if (this.nowloading) {
        this.resetFlg = true;
      } else {
        this.init();
      }
    },
    onTitleButtonClick() {
      // this.$router.push({ name: 'TitleView', params: { noDirect: true } });
      this.$router.push({ name: 'TitleView' });
    },
  },
  computed: {
    showTurn(): string {
      return this.othello.getTurnColor();
    },
    playerAttackOrder(): string {
      return this.othello.cpuColor === 'Black' ? '後手' : '先手';
    },
    cpuAttackOrder(): string {
      return this.othello.cpuColor === 'Black' ? '先手' : '後手';
    },
    plyerStonesNum(): number {
      const rslt = this.othello.getResult();
      return this.othello.cpuColor === 'White' ? rslt.blackNum : rslt.whiteNum;
    },
    cpuStonesNum(): number {
      const rslt = this.othello.getResult();
      return this.othello.cpuColor === 'White' ? rslt.whiteNum : rslt.blackNum;
    },
    isCpuBlack(): boolean {
      return this.othello.cpuColor === 'Black';
    },
    playerInfoStr(): string {
      if (this.gameEndFlg) {
        const rslt = this.othello.getResult();
        if (rslt.blackNum == rslt.whiteNum) {
          return '「引き分けです」';
        } else if (this.othello.cpuColor === 'Black') {
          return rslt.blackNum > rslt.whiteNum ? '「あなたの負けです」' : '「あなたの勝ちです」';
        } else {
          return rslt.blackNum < rslt.whiteNum ? '「あなたの負けです」' : '「あなたの勝ちです」';
        }
      } else {
        return !this.othello.isCpuTurn() ? '「あなたの番です」' : '「CPU思考中」';
      }
    },
  },
  watch: {
    changeTurnFlg: async function (newVal, oldVal) {
      //resetButtonが押された場合はここでリセット
      if (this.resetFlg) {
        //reset処理
        this.init();
        //flgを戻す
        this.resetFlg = false;
        return;
      }

      //CPUターン
      if (this.othello.isCpuTurn()) {
        this.nowloading = true;
        console.log('--- CPU Turn -------------');
        //ここでCPU処理を実行
        let color = this.othello.getTurnColor();

        //1.4s待つ
        await waitTime(1400);

        //CPUの手を取得, 打つ場所がないときはNullが返却される
        let cpuCellPos = this.othello.cpuAlgor();

        if (cpuCellPos) {
          let reverseCells = this.othello.board.getReverseCells(cpuCellPos, color);

          //石をおく
          this.othello.board.setStone(cpuCellPos, color);

          //石を一つづつひっくり返す
          await this.reverseStonesAsync(reverseCells, color);

          // Game終了判断
          if (this.othello.isGameFinish()) {
            this.gameEndFlg = true;
            return;
          }
        }
        //Pass
        else {
          console.log('--- CPU Path ---------');
        }

        //0.7待つ(調整)
        await waitTime(700);

        //Turnを変更
        this.othello.setChangeTurn();
        this.nowloading = false;
        this.changeTurnFlg = !this.changeTurnFlg;
      } else {
        console.log('--- My Turn -------------');
        //Pass判定
        if (this.othello.isPass()) {
          console.log('--- Player Path ---------');
          //Turnを変更
          this.othello.setChangeTurn();
          this.changeTurnFlg = !this.changeTurnFlg;
        }
      }
    },
  },
});
</script>

<style scoped>
/* 拡大 */
#scale-wrraper2 {
  transform-origin: 50% 50%;
  /* transform: scale(1.104, 1.104); */
  position: relative;
}
/* 左右中央配置 */
.scale-wrraper {
  top: 0%;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
}
.game-wrraper {
  /* margin: 0 auto; */
  /* 371+2+2=375 */
  width: 371px;
  /* position: relative; */
  padding: 6px 2px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 371px;
  margin-bottom: 6px;
}

/* .menu-button {
  margin-left: 10px;
} */

.cpu-info {
  width: 361px;
  background-color: #8b4513;
  text-align: left;
  line-height: 50px;
  color: white;
  padding-left: 10px;
  position: relative;
}

.player-info {
  width: 361px;
  /* height: 50px; */
  background-color: #8b4513;
  text-align: left;
  line-height: 50px;
  color: white;
  padding-left: 10px;
  position: relative;
  top: 3px;
}

.stone {
  display: inline-block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 10px 0 -10px 0px;
}
.black-stone {
  background-color: black;
}

.white-stone {
  background-color: white;
}

.stone-info {
  position: absolute;
  right: 10px;
}
</style>
