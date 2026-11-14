import { useCallback, useEffect, type RefObject } from "react";
import type Highcharts from "highcharts";
import type { HighchartsReactRefObject } from "highcharts-react-official";

const useHighchartsResize = (
    containerRef: RefObject<HTMLDivElement | null>,
    chartRef: RefObject<HighchartsReactRefObject | null>
) => {
    const resizeChart = useCallback((chart?: Highcharts.Chart) => {
        const container = containerRef.current;
        const chartInstance = chart ?? chartRef.current?.chart;
        if (!container || !chartInstance) return;

        const { width, height } = container.getBoundingClientRect();
        if (width > 0 && height > 0) {
            chartInstance.setSize(width, height, false);
        }
    }, [chartRef, containerRef]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => resizeChart());
        observer.observe(container);
        resizeChart();

        return () => observer.disconnect();
    }, [containerRef, resizeChart]);

    return resizeChart;
};

export default useHighchartsResize;
