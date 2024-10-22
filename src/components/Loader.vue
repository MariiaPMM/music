<template>
  <div class="loader-overlay" v-if="isLoading">
    <div class="loader">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    duration: {
      type: Number,
      default: 60000
    }
  },
  data() {
    return {
      isLoading: true
    };
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, this.duration);
  }
};
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 1); 
  z-index: 99990000000000000000000000000000; 
  display: flex;
  justify-content: center;
  align-items: center;
  
}

.loader {
  width: 45px;
  aspect-ratio: .75;
  --c: no-repeat linear-gradient(#00ff15 0 0);
  background: 
    var(--c) 0%   50%,
    var(--c) 50%  50%,
    var(--c) 100% 50%;
  animation: l7 2s infinite linear alternate;
}

@keyframes l7 {
  0%  {background-size: 20% 50%, 20% 50%, 20% 50%;}
  20% {background-size: 20% 20%, 20% 50%, 20% 50%;}
  40% {background-size: 20% 100%, 20% 20%, 20% 50%;}
  60% {background-size: 20% 50%, 20% 100%, 20% 20%;}
  80% {background-size: 20% 50%, 20% 50%, 20% 100%;}
  100%{background-size: 20% 50%, 20% 50%, 20% 50%;}
}
</style>
