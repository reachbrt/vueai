<template>
  <div class="usage-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, PropType } from 'vue';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartConfiguration
} from 'chart.js';
import type { ChartData } from '../types';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default defineComponent({
  name: 'UsageChart',
  props: {
    data: {
      type: Object as PropType<ChartData>,
      required: true
    },
    type: {
      type: String as PropType<'line' | 'bar'>,
      default: 'line'
    },
    height: {
      type: Number,
      default: 300
    }
  },
  setup(props) {
    const chartCanvas = ref<HTMLCanvasElement | null>(null);
    let chartInstance: Chart | null = null;

    const createChart = () => {
      if (!chartCanvas.value) return;

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy();
      }

      const config: ChartConfiguration = {
        type: props.type,
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false,
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: 'white',
              bodyColor: 'white',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return `${label}: ${value.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              display: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 12
                }
              }
            },
            y: {
              display: true,
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return Number(value).toLocaleString();
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          elements: {
            line: {
              tension: 0.4,
              borderWidth: 2
            },
            point: {
              radius: 4,
              hoverRadius: 6,
              borderWidth: 2,
              backgroundColor: 'white'
            },
            bar: {
              borderRadius: 4,
              borderSkipped: false
            }
          }
        }
      };

      chartInstance = new Chart(chartCanvas.value, config);
    };

    const updateChart = () => {
      if (chartInstance) {
        chartInstance.data = props.data;
        chartInstance.update('none');
      }
    };

    onMounted(() => {
      createChart();
    });

    watch(() => props.data, updateChart, { deep: true });
    watch(() => props.type, createChart);

    return {
      chartCanvas
    };
  }
});
</script>

<style scoped>
.usage-chart {
  position: relative;
  height: 300px;
  width: 100%;
}

.usage-chart canvas {
  max-height: 100%;
}
</style>
