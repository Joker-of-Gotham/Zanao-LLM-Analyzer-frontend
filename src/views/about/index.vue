<template>
  <div class="about-page">
    <n-card title="关于 Zanao LLM Analyzer">
      <n-space vertical :size="24">
        <n-h2>项目愿景</n-h2>
        <p>
          在这个信息日益庞杂的年代，我们不得不被迫查看过量的信息，陷入到信息漩涡中。带来的后果就是，效率下降、内心焦虑、静不下心等不良影响。
        </p>
        <p>
          因此，我决定创建一个赞哦校园集市信息分析助手 (Zanao LLM Analyzer)，用于信息提取分类，这样既可以快速追踪热帖，也不会漏掉关键信息，更能让自身感受到信息掌控力从而潜心提升自我。
        </p>
        <n-divider />
        <n-h2>核心功能</n-h2>
        <n-ul>
          <n-li><b>热度追踪:</b> 实时监控校园热点，通过多维度排序和可视化图表，快速掌握舆论动态。</n-li>
          <n-li><b>细节问答:</b> 基于本地大语言模型，提供一个智能问答接口，深入探寻信息细节。</n-li>
          <n-li><b>资源检索:</b> 通过定制化的工作流，高效检索和定位所需资源。</n-li>
          <n-li><b>舆情检测:</b> 宏观分析社区情绪动向，发现新晋话题和活跃用户。</n-li>
          <n-li><b>用户分析:</b> 深入洞察单一用户的行为轨迹和兴趣画像。</n-li>
        </n-ul>
        <n-divider />
        <n-h2>技术栈</n-h2>
        <p>
          本项目前端采用 Vue 3 + TypeScript + Vite + Naive UI 构建，后端服务与 AI 工作流基于 Python, Ollama, Dify 等技术实现。
        </p>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NH2, NDivider, NUl, NLi } from 'naive-ui';
</script>

<style scoped>
.about-page {
  max-width: 960px;
  margin: 0 auto;
}
p, .n-li {
  line-height: 1.8;
  color: #c7c7d1;
}
</style>