<template>
  <div ref="chartWrapperRef" style="width:100%; height:100%;">
    <div ref="chartRef" style="width:100%; height:100%;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { useElementSize } from '@vueuse/core';

const props = defineProps<{
  option: EChartsOption;
}>();

const chartWrapperRef = ref<HTMLDivElement>();
const chartRef = ref<HTMLDivElement>();
let chartInstance: echarts.ECharts | null = null;

// ✅ 这是一个更高效、更简洁的响应式方式来替代您的 setInterval
const { width, height } = useElementSize(chartWrapperRef);

const initChart = () => {
  if (chartRef.value && !chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }
  if (chartInstance) {
    chartInstance.setOption(props.option, true);
  }
};

const resizeChart = () => {
  chartInstance?.resize();
};

onMounted(() => {
  // nextTick 确保 DOM 元素已挂载
  nextTick(() => {
    initChart();
  });
});

onUnmounted(() => {
  chartInstance?.dispose();
});

// 当图表配置数据变化时更新图表
watch(() => props.option, (newOption) => {
  if (chartInstance) {
    chartInstance.setOption(newOption, true);
  } else {
    initChart();
  }
}, { deep: true });

// ✅ 当容器尺寸变化时，自动调整图表大小
watch([width, height], () => {
  nextTick(() => {
     resizeChart();
  });
});
</script>