<template>
  <div id="app">
    <loader></loader>
    <router-view v-slot="{ Component }">
    <transition name="scale" >
      <component :is="Component" />
    </transition>
  </router-view>
  </div>
</template>
<script>

export default {
  name: 'App'
}
</script>


