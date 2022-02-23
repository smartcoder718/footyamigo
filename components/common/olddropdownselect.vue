<template>
  <div class="footy-dropdown-select">
    <b-dropdown
      block
      variant="white"
      no-caret
      :id="id"
      no-flip
      menu-class="w-100 border-0 shadow-sm p-0"
    >
      <template slot="button-content">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div class="text-left">
            <span class="">{{
              typeof optionsByKey[selected] == "object"
                ? optionsByKey[selected].text
                : optionsByKey[selected]
            }}</span>
          </div>
          <div>
            <span class="material-icons-outlined medium-icon">
              expand_more
            </span>
          </div>
        </div>
      </template>
      <b-dropdown-item
        v-for="(option, index) in options"
        :key="'option' + index"
        @click="
          typeof option == 'string'
            ? (selected = option)
            : (selected = option.value)
        "
      >
        {{ typeof option == "string" ? option : option.text }}</b-dropdown-item
      >
    </b-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    options: Array,
    value: null,
    id: String,
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
    optionsByKey() {
      let options = {};
      let value;
      for (var opt of this.options) {
        if (typeof opt == "string") {
          value = opt;
        } else {
          value = opt["value"];
        }
        options[value] = opt;
      }
      return options;
    },
  },
  methods: {},
};
</script>

