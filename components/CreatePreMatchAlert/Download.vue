<template>
  <div>
    <div class="box-holder">
      <div>
        <h1 class="title">Download</h1>
        <h5 class="sub-title">FHC 1.5 Corner</h5>
        <div>
          <div class="format-box" v-for="format in formats" :key="format.value">
            <div class="d-flex align-items-center">
              <div class="bg-lightpink mr-3 svg-holder" >
                <b-img :src="`/vectors/${format.value}.svg`"> </b-img>
              </div>

              {{ format.text }}
            </div>
            <div>
              <b-button variant="primary" class="footy-button footy-button"
                ><span class="material-icons-outlined mr-2">
                  file_download </span
                >Download</b-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formats: [
        { text: "Excel", value: "excel" },
        { text: "CSV", value: "csv" },
        { text: "OpenOffice", value: "open-office" },
        { text: "HTML", value: "html" },
        { text: "PDF", value: "pdf" },
        { text: "TSV", value: "tsv" },
      ],
    };
  },
};
</script>

<style lang="scss">
.format-box {
  background: #ffffff;
  border: 1px solid #f0f1f0;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.svg-holder {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>