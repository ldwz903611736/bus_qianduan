<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎来到汽车租赁后台管理系统！</div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
