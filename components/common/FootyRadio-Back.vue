<template>
  <b-form-group :label="label" v-slot="{ id }" class="footy-radio">
    <b-form-radio-group v-model="selected" :aria-describedby="id" :name="id">
      <b-form-radio
        :value="getVal(option)"
        v-for="option in options"
        :key="getVal(option)"
        :class="getVariant(option)"
        ><div class="centered">
          <div v-if="option.image">
            <b-img fluid :src="option.image" class="pr-3"> </b-img>
          </div>
          <div>
            {{ typeof option == "object" ? option.text : option }}
          </div>
        </div>
      </b-form-radio>
      <slot name="form-radio"></slot>
    </b-form-radio-group>
  </b-form-group>
</template>
<style lang="scss">
/*
.footy-radio {
  .centered {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .custom-radio {
    background: #ffffff;
    border: 2px solid #cfd8cf;
    box-sizing: border-box;
    border-radius: 12px;

    margin-bottom: 10px;
  }

  .active-radio.custom-radio {
    background: #ffffff;
    border: 2px solid #60b15a;
  }
  .custom-control {
    padding: 0;
  }
  .custom-control-label {
    display: inline-flex;
    align-items: center;
    padding: 15px 16px;
  }
  has_image {

  }

  .custom-control-label::before {
    position: static;
    margin-right: 10px;
    padding: 3px;
    background-clip: content-box;
  }
  .custom-control-label::after {
    display: none;
  }
}*/
</style>
<script>
export default {
  props: {
    label: String,
    name: String,
    image: String,
    id: String,
    type: {
      type: String,
      default: "text",
    },
    options: Array,
    value: [String, Object, Number],
  },
  methods: {
    getVal(option) {
      if (typeof option == "object") {
        return option.value;
      } else {
        return option;
      }
    },
    setVal(option) {
      this.selected = this.getVal(option);
    },
    getVariant(option) {
      let has_image = ""
      if(option.image) {
        has_image = "has-image"
      }
      
      return this.getVal(option) == this.selected
        ? "active-radio text-success "+has_image
        : has_image;
    },
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

