<template>
  <div>
    <slot name="label">
      <label v-if="label" class="footy-label"
        >{{ label }}
        <span v-if="info">
          <InfoIcon class="icon-right" :id="id + '-info'"> </InfoIcon>
          <b-popover
            :target="id + '-info'"
            variant="grey"
            triggers="hover"
            placement="topright"
          >
            {{ info }}
          </b-popover>
        </span>
      </label>
    </slot>

    <div
      :class="[
        'footy-radio-container',
        scrollOnMobile ? 'scroll-on-mobile' : '',
        fillWidth ? 'fillWidth' : '',
        noWrap ? 'no-flex-wrap' : '',
        containerClass
      ]"
    >
      <div
        class="footy-radio"
        :class="radioClass"
        v-for="option in options"
        :key="uuid + '_' + option.value"
      >
        <input
          @change="customSelected = false"
          type="radio"
          :id="uuid + '_' + option.value"
          :value="option.value"
          v-model="selected"
          :class="option.image ? 'with-image' : ''"
          :name="uuid"
          :disabled="option.disabled"
        />
        <label
          :for="uuid + '_' + option.value"
          :class="[option.labelClass, radioClass]"
        >
          <template v-if="option.image">
            <b-img
              fluid
              :src="option.image"
              class="mb-md-4 mb-3 mt-3"
              :class="option.imgclass"
            >
            </b-img>
            <br />
          </template>

          {{ option.text }}
          <template v-if="option.info">
            <br />
            <h6 class="text-grey">{{ option.info }}</h6>
          </template></label
        >
      </div>

      <div class="footy-radio" v-if="customInput">
        <input
          type="radio"
          :value="true"
          id="custom"
          :name="uuid"
          v-model="customSelected"
        />
        <label for="custom" class="custom-lable">
          <input
            v-if="customSelected"
            v-model="selected"
            type="number"
            :name="uuid"
            :id="uuid"
          />
          <span v-else>Custom</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    image: String,
    id: String,
    type: {
      type: String,
      default: "text"
    },
    scrollOnMobile: Boolean,
    fillWidth: Boolean,
    options: Array,
    value: null,
    info: String,
    radioClass: String,
    containerClass: String,
    noWrap: Boolean,
    customInput: Boolean
  },
  data() {
    return {
      customSelected: false
    };
  },
  computed: {
    uuid() {
      return this.id + "-" + this.$uuid.v4();
    },
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  watch: {
    customSelected(newVal) {
      if (newVal) {
        this.selected = null;
      }
    }
  }
};
</script>

<style lang="scss">
@import "~assets/scss/breakpoints";
@import "~/assets/scss/colors";
.footy-radio-container {
  position: relative;
  display: flex;
  column-gap: 8px;
  flex-shrink: 0;
  row-gap: 20px;
  //flex-wrap: wrap;
  max-width: 100%;
}

.fillWidth {
  justify-content: space-between;
  .footy-radio {
    margin-right: 0px;
  }
}

.footy-radio {
  position: relative;
  label {
    white-space: nowrap
  }
  [type="number"] {
    max-width: 117px;
    width: 100%;
    height: 100%;
    border: none;
    line-height: 28px !important;
    display: inline-block;
    color: #202c5c;
    font-size: 16px;
  }
  [type="radio"]:checked,
  [type="radio"]:not(:checked) {
    position: absolute;
    opacity: 0;
  }
  [type="radio"]:checked + label,
  [type="radio"]:not(:checked) + label {
    position: relative;
    padding: 15px 16px;
    padding-left: 40px;
    cursor: pointer;
    line-height: 20px;
    display: inline-block;

    color: $dark-1;
    border: 2px solid #cfd8cf;
    box-sizing: border-box;
    background: white;
    border-radius: 12px;
    // text-align: center;
  }
  .with-image[type="radio"]:checked + label,
  .with-image[type="radio"]:not(:checked) + label {
    padding-right: 10px;
    padding-left: 10px;
    min-width: 150px;
  }
  .with-image[type="radio"]:checked + label:before,
  .with-image[type="radio"]:not(:checked) + label:before {
    right: 2px;
    top: 20px;
    left: auto;
  }

  [type="radio"]:checked + label {
    border: 2px solid #60b15a;
    color: #60b15a;
  }

  [type="radio"]:checked + label:before,
  [type="radio"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 22px;
    top: 50%;
    width: 16px;
    height: 16px;
    border: 4px solid white;
    box-shadow: 0px 0px 0px 2px #cfd8cf;
    border-radius: 50%;
    background: #fff;
    transform: translate(-50%, -50%);
  }
  [type="radio"]:checked + label:before {
    border: 4px solid white;
    box-shadow: 0px 0px 0px 2px #60b15a;
    background: #60b15a;
  }
  [type="radio"]:disabled + label {
    // background: yellow !important;
    text-decoration: line-through;
  }
}

@media (max-width: $lg) {
  .footy-radio-container {
    //display: grid;
    //grid-template-columns: 1fr 1fr 1fr;
    overflow: auto;
  }

  .footy-radio {
    [type="radio"]:checked + label,
    [type="radio"]:not(:checked) + label {
      // min-height: 54px !important;
      // white-space: nowrap;
    }
  }
}
</style>
