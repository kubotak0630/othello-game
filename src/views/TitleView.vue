<template>
  <div class="title">
    <h1>オセロゲーム</h1>
    <div>
      <el-radio-group class="attack-order-radio" v-model="radio" @change="onChangeRadio">
        <el-radio-button :label="0" class="hoge">先手</el-radio-button>
        <el-radio-button :label="1">後手</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <el-button class="start-button" type="primary" @click="onStartClick">Play Start</el-button>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';

type DataType = {
  radio: number;
};

export default Vue.extend({
  name: 'TitleView',
  components: {
    // HelloWorld,
  },
  data(): DataType {
    return {
      radio: 0,
    };
  },
  methods: {
    onStartClick() {
      // this.$router.push({ name: 'Game', params: { noDirect: true } });
      this.$router.push({ name: 'Game' });
    },
    onChangeRadio(evt: number) {
      console.log(evt);
    },
  },
});
</script>

<style scoped>
.attack-order-radio {
  margin-bottom: 20px;
}

.start-button {
  height: 80px;
  width: 200px;
  font-size: 24px;
}
</style>
