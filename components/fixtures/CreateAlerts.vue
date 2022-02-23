<template>
  <b-tab active class="create-rules">
    <template #title>
      <h3 class="tab-title">Create</h3>
    </template>
    <div class="action-rules">
      <b-button class="add">
        <span class="mr-2">
          <img src="/icons/plus.svg?inline" alt="" />
        </span>
        <span class="text"> Add Rule </span>
      </b-button>
      <b-button class="search">
        <span class="mr-2">
          <img src="/icons/searcha.svg?inline" alt="" />
        </span>
        <span class="text"> Search </span>
      </b-button>
    </div>
    <div class="main-rules">
      <div class="rules-length my-4">
        <h3>Rules</h3>
        <p>0</p>
      </div>
      <!-- <div class="rules">
                            <div class="single-rule"></div>
                          </div> -->
    </div>
    <div class="rules-creation">
      <PreMatchRules :form="$store.state.form" ref="prematch"> </PreMatchRules>
    </div>
  </b-tab>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>