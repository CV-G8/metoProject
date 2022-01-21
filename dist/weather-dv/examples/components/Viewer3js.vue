<template>
  <div></div>
</template>

<script>
import MeBaseViewer from "@mesh-3d/core/Source/MeBaseViewer";
export default {
  data() {
    return {
      m_config: this.config || {},
    };
  },
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this._viewer = new MeBaseViewer(
      Object.assign({ container: this.$el }, this.m_config)
    );
    this.$emit("ready", this._viewer);
  },
  destroyed() {
    this._viewer = this._viewer && this._viewer.dispose();
  },
};
</script>

<style>
</style>