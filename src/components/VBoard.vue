<template>
  <div class="borad">
    <!-- 配列は追加や削除がないのでkeyはindexをそのまま利用(重複しなければなんでもいい) -->
    <div class="container" v-for="y in 8" :key="(y + 1) * 8">
      <VCell
        v-for="x in 8"
        :key="x"
        :cell="board.getCell({ x: x - 1, y: y - 1 })"
        @emit-cell-click="onCellClick"
      ></VCell>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import VCell from './VCell.vue';
import Cell from '../cell';
import Board, { Pos } from '../board';
import GameView from '../views/GameView.vue';
type DataType = {};

export default Vue.extend({
  name: 'VBoard',
  components: {
    VCell,
  },
  props: {
    board: {
      type: Object as PropType<Board>,
      required: true,
    },
    nowloading: {
      type: Boolean,
      required: true,
    },
  },
  data(): DataType {
    return {};
  },
  methods: {
    // 親のGameViewにイベントを伝える。処理中のマウス入力は無視する
    onCellClick(cellPos: Pos) {
      if (!this.nowloading) {
        this.$emit('emit-cell-click2', cellPos);
      }
    },
  },
  created() {},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  flex-direction: row;
}
</style>
