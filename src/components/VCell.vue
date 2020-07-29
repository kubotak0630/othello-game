<template>
  <div>
    <div class="cell" @click="onClick">
      <div v-bind:class="{ 'black-stone': isBlack, 'white-stone': isWhite, stone: true }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Cell from '../cell';

export default Vue.extend({
  name: 'VCell',
  props: {
    cell: {
      type: Object as PropType<Cell>,
      required: true,
    },
  },
  methods: {
    // マウスクリックしたセルに石が置いてなかったらクリックイベントを飛ばす
    onClick() {
      if (this.cell.stone === 'None') {
        this.$emit('emit-cell-click', this.cell.pos);
      }
    },
  },
  computed: {
    isBlack(): boolean {
      return this.cell.stone === 'Black';
    },
    isWhite(): boolean {
      return this.cell.stone === 'White';
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cell {
  width: 50px;
  height: 50px;
  border: 3px solid black;
  background-color: darkgreen;
  margin: 0 -3px -3px 0;
  position: relative;
  top: 0px;
}

.stone {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
}

.black-stone {
  background-color: black;
  transition: 1s;
}

.white-stone {
  background-color: white;
  position: absolute;
  transition: 1s;
}
</style>
