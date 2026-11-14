import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import { useEffect, useRef, useState } from "react";
import { useStore } from "react-redux";
import type { AppStore } from "@modules/redux/store";
import { TWO_PANE_BUCKET_MS } from "@modules/area-spline/slice";
import type { HighchartsReactRefObject } from "highcharts-react-official";
import useHighchartsResize from "@helpers/useHighchartsResize";

const TwoPane = () => {
    const store = useStore<AppStore>();
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HighchartsReactRefObject | null>(null);
    const resizeChart = useHighchartsResize(containerRef, chartRef);
    const [chartData, setChartData] = useState(() => {
        return store.getState().areaSpline.twoPaneData;
    });

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setChartData(store.getState().areaSpline.twoPaneData);
        }, TWO_PANE_BUCKET_MS);

        return () => window.clearInterval(intervalId);
    }, [store]);

    const chartOptions = {
        chart: {
            reflow: true
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: "datetime" as const
        },
        rangeSelector: {
            enabled: false
        },
        title: {
            style: {
                opacity: 0
            }
        },
        yAxis: [
            {
                // Pane 1: Price (Top 70%)
                labels: {
                    align: "right",
                    x: -3
                },
                title: {
                    text: "Price ($)"
                },
                height: "60%",
                lineWidth: 2,
                resize: {
                    enabled: true // Allows users to drag the divider between panes
                }
            },
            {
            // Pane 2: Volume (Bottom 25%, leaving a 5% gap)
                labels: {
                    align: "right",
                    x: -3
                },
                title: {
                    text: "Volume"
                },
                top: "75%",
                height: "25%",
                offset: 0,
                lineWidth: 2
            }
        ],
        tooltip: {
            split: true // Displays separate tooltip boxes aligned to each pane
        },
        series: [
            {
                name: "Price",
                type: "spline",
                yAxis: 0,
                data: chartData.priceData,
                tooltip: {
                    valueDecimals: 2
                }
            },
            {
                name: "Volume",
                type: "column",
                yAxis: 1,
                data: chartData.volumeData,
                color: "#90EE90",
                tooltip: {
                    valueDecimals: 4
                }
            }
        ]
    }

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
            {chartData.priceData.length === 0 ? <span>Loading...</span> : (
                <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
                    options={chartOptions}
                    callback={resizeChart}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            )}
        </div>
    );
}

export default TwoPane;