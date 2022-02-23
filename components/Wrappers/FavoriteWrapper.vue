<template>
  <div class="favorite-wrapper " @click="fixture.fav = !fixture.fav">
    <span class="material-icons-outlined star-icon">
      <svg
        v-if="!fixture.fav"
        width="20"
        height="19"
        viewBox="0 0 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.7"
          d="M6.81708 6.03091L6.55759 6.06846L1.09592 6.85879L1.09556 6.85884C0.522623 6.94132 0.302357 7.63627 0.710102 8.03033L0.710244 8.03047L4.66164 11.8523L4.85184 12.0362L4.8067 12.2969L3.87218 17.6953C3.87217 17.6954 3.87215 17.6955 3.87214 17.6956C3.87213 17.6956 3.87213 17.6957 3.87212 17.6957C3.77661 18.2514 4.37078 18.6869 4.88119 18.4184L4.88275 18.4175L9.76873 15.8684L10 15.7478L10.2313 15.8684L15.1172 18.4175L15.1173 18.4176C15.6313 18.6858 16.2231 18.2482 16.1278 17.6953L15.1933 12.2969L15.1482 12.0362L15.3384 11.8523L19.2898 8.03047L19.2899 8.03033C19.6976 7.63627 19.4774 6.94132 18.9044 6.85884L18.9041 6.85879L13.4424 6.06846L13.1829 6.03091L13.0662 5.79611L10.6256 0.884357C10.6255 0.884246 10.6255 0.884136 10.6254 0.884025L6.81708 6.03091ZM6.81708 6.03091L6.93375 5.79611L9.37478 0.88362L6.81708 6.03091Z"
          stroke="#60685F"
        />
      </svg>
      <svg
        v-else
        width="20"
        height="19"
        viewBox="0 0 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.9271 0.660936L6.48599 5.57361L1.02432 6.36394C0.0448775 6.50494 -0.347645 7.70342 0.362634 8.38986L4.31403 12.2117L3.37945 17.6104C3.21123 18.5863 4.24674 19.3172 5.11403 18.8608L10 16.3117L14.886 18.8608C15.7533 19.3135 16.7888 18.5863 16.6206 17.6104L15.686 12.2117L19.6374 8.38986C20.3476 7.70342 19.9551 6.50494 18.9757 6.36394L13.514 5.57361L11.0729 0.660936C10.6355 -0.214737 9.36823 -0.225869 8.9271 0.660936Z"
          fill="#E4AF5E"
        />
      </svg>
    </span>
   
  </div>
</template>

<script>
export default {
  props: {
    fixture: Object
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
.favorite-wrapper {
  display: flex;
  cursor: pointer;
  .bg-box {
    display: none;
  }
}
@media (max-width: $lg) {
  .favorite-wrapper {
    cursor: pointer;
    position: absolute;
    right: 0;
    border: none;
    top: 0;
    //height: calc(100% - 94px) !important;
    display: flex;
    flex-direction: column;
    align-items: center !important;
    border-right: none !important;
    // background: red;
    // background: #ffffff !important;
    padding: 0px !important;
    width: 57px;
    justify-content: space-between !important;
    background: linear-gradient(
      269.38deg,
      #ffffff 0.62%,
      rgba(255, 255, 255, 0.9) 99.56%
    ) !important;

    .star-icon {
      padding-top: 16px;
      // align-self: flex-end;
    }
    .bg-box {
      display: block;
      height: 56px;
      width: 100%;
    }
  }
}
</style>
