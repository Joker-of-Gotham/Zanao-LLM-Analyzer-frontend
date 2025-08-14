<template>
  <!-- 
    n-config-provider 是 Naive UI 的核心，用于提供全局配置，最重要的是主题。
    我们将 darkTheme 应用到整个应用中。
  -->
  <n-config-provider :theme="darkTheme">
    <!-- 
      n-dialog-provider 和 n-message-provider 用于未来的弹窗和全局消息提示功能，
      现在提前加上是最佳实践。
    -->
    <n-dialog-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  darkTheme, // 导入暗黑主题对象
} from 'naive-ui';
</script>

<style>
/* 
  我们可以将全局样式直接放在这里，或者继续使用 main.scss。
  为了统一，我们保持 main.scss 的方式。
  这里的 style 标签可以保持为空。
*/
</style>