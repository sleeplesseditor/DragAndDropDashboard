import { HighchartsReact } from "highcharts-react-official";
import Highcharts from "highcharts";
import "highcharts/modules/bullet";
import { useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@modules/redux/store";
import type { HighchartsReactRefObject } from "highcharts-react-official";
import useHighchartsResize from "@helpers/useHighchartsResize";

const BulletChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HighchartsReactRefObject | null>(null);
    const resizeChart = useHighchartsResize(chartContainerRef, chartRef);

    const chartContainerRefSecond = useRef<HTMLDivElement>(null);
    const chartRefSecond = useRef<HighchartsReactRefObject | null>(null);
    const resizeChartSecond = useHighchartsResize(chartContainerRefSecond, chartRefSecond);
    const quote = useSelector((state: RootState) => state.selection.quote);
    const {
        currentPrice,
        openingPrice,
        lowPrice,
        highPrice,
        previousClosePrice
    } = quote;

    if (
        typeof currentPrice !== "number" || !Number.isFinite(currentPrice) ||
        typeof openingPrice !== "number" || !Number.isFinite(openingPrice) ||
        typeof lowPrice !== "number" || !Number.isFinite(lowPrice) ||
        typeof highPrice !== "number" || !Number.isFinite(highPrice) ||
        typeof previousClosePrice !== "number" || !Number.isFinite(previousClosePrice) ||
        previousClosePrice === 0
    ) {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <span>Loading quote...</span>
            </div>
        );
    }

    const dailyPercentageChange = ((currentPrice - previousClosePrice) / previousClosePrice) * 100;

    const chartOptions = {
        chart: {
            height: 85,
            inverted: true,
            type: "bullet" as const,
            reflow: true
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            bullet: {
                pointPadding: 0.25,
                borderWidth: 0,
                targetOptions: {
                    width: "200%",
                    color: "#333333"
                }
            }
        },
        title: {
            text: null
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: ["Session Open vs. Live Price"],
            title: {
                text: null
            }
        },
        yAxis: [{
            min: Math.min(lowPrice, openingPrice),
            max: Math.max(highPrice, openingPrice),
            title: {
                text: "Price"
            }
        }],
        series: [{
            name: "Session Open vs. Live Price",
            type: "bullet" as const,
            yAxis: 0,
            data: [{
                x: 0,
                y: currentPrice,
                target: openingPrice,
                color: "#26a69a"
            }],
            tooltip: {
                pointFormat: "<b>{point.y:.2f}</b> (with target at {point.target:.2f})"
            }
        }]
    };

    const secondOptions = {
        ...chartOptions,
        xAxis: {
            categories: ["Daily Percentage Change"],
            title: {
                text: null
            }
        },
        yAxis: [{
            softMin: -5,
            softMax: 5,
            title: {
                text: "Change (%)"
            },
            // opposite: true
        }],
        series: [{
            name: "Daily Percentage Change",
            type: "bullet" as const,
            yAxis: 0,
            data: [{
                x: 0,
                y: dailyPercentageChange,
                target: 0,
                color: dailyPercentageChange < 0 ? "red" : "#26a69a"
            }],
            tooltip: {
                pointFormat: "<b>{point.y:.2f}%</b> (with target at {point.target:.2f}%)"
            }
        }]
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            minHeight: 0
        }}>
            <div ref={chartContainerRef} style={{ flex: "1 1 0", height: 85 }}>
                <HighchartsReact
                    ref={chartRef}
                    highcharts={Highcharts}
                    options={chartOptions}
                    callback={resizeChart}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            </div>
            <div ref={chartContainerRefSecond} style={{ flex: "1 1 0", height: 85 }}>
                <HighchartsReact
                    ref={chartRefSecond}
                    highcharts={Highcharts}
                    options={secondOptions}
                    callback={resizeChartSecond}
                    containerProps={{ style: { width: "100%", height: "100%" } }}
                />
            </div>
        </div>
    )
};

export default BulletChart;