<template>
  <transition name="modal-animation">
    <div
      v-if="modalActive"
      class="mobile-modal"
      :class="{ blackbg: sidebar, whiteOverlay: whiteOverlay }"
      @click.self="close"
    >
      <transition
        name="animate__animated animate__slideInUp "
        leave-active-class="animated animate__slideOutDown animate__slow"
      >
        <div
          v-if="modalActive"
          class="modal-inner"
          :class="{ sidebg: showHeader }"
        >
          <div class="modal--header ">
            <span @click="close">
              <img :src="`/icons/close.svg?inline`" alt="" />
            </span>
          </div>
          <slot />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    close() {
      this.$emit("close");
    }
  },
  props: ["modalActive", "title", "sidebar", "showHeader", "whiteOverlay"]
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/breakpoints";
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.mobile-modal {
  display: flex;
  align-items: flex-end;
  height: 100%;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  //background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  &.blackbg {
    background: rgba(96, 104, 95, 0.7);
    z-index: -1;
    left: 256px;
  }
  &.whiteOverlay {
    background: rgba(255, 255, 255, 0.9);
  }
  @media (min-width: $lg) {
    display: none;
  }

  .modal-inner {
    position: relative;
    width: 100%;

    border-radius: 20px 20px 0px 0px;
    padding: 0px;
    height: 90%;

    .modal--header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 20px;
      position: absolute;
      top: 0px;
      right: 0px;
      span {
        cursor: pointer;
        width: 60px;
        height: 60px;
        background: rgb(255, 255, 255);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-content: center;
        img {
          width: 20px;
          height: 20px;
          margin: auto;
        }
      }
    }

    button {
      padding: 20px 30px;
      border: none;
      font-size: 16px;
      background-color: crimson;
      color: #fff;
      cursor: pointer;
    }
    &.sidebg {
      background: #f7f9f7;
    }
  }
}
</style>
