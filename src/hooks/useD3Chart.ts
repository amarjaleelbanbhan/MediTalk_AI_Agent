import { useEffect, useRef } from "react";
import * as d3 from "d3";

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export const useD3BarChart = (
  data: ChartData[],
  width: number = 600,
  height: number = 400
) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.value) || 100])
      .range([innerHeight, 0]);

    // Bars with animation
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d: ChartData) => xScale(d.label) || 0)
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d: ChartData) => d.color || "#3B82F6")
      .attr("rx", 4)
      .transition()
      .duration(800)
      .ease(d3.easeQuadOut)
      .attr("y", (d: ChartData) => yScale(d.value))
      .attr("height", (d: ChartData) => innerHeight - yScale(d.value));

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style("font-size", "12px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size", "12px");

    // Add value labels on bars
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d: ChartData) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr("y", innerHeight)
      .attr("text-anchor", "middle")
      .attr("dy", "-5px")
      .attr("fill", "#374151")
      .attr("font-weight", "bold")
      .attr("font-size", "12px")
      .text((d: ChartData) => d.value)
      .transition()
      .duration(800)
      .ease(d3.easeQuadOut)
      .attr("y", (d: ChartData) => yScale(d.value) - 5);
  }, [data, width, height]);

  return svgRef;
};

export const useD3ScatterChart = (
  data: ChartData[],
  width: number = 600,
  height: number = 400
) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.value) || 100])
      .range([innerHeight, 0]);

    // Circles with animation
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (_: ChartData, i: number) => xScale(i))
      .attr("cy", innerHeight)
      .attr("r", 0)
      .attr("fill", (d: ChartData) => d.color || "#8B5CF6")
      .attr("opacity", 0.7)
      .transition()
      .duration(800)
      .ease(d3.easeQuadOut)
      .attr("cy", (d: ChartData) => yScale(d.value))
      .attr("r", 6);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style("font-size", "12px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size", "12px");
  }, [data, width, height]);

  return svgRef;
};

export const useD3LineChart = (
  data: ChartData[],
  width: number = 600,
  height: number = 400
) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d: ChartData) => d.value) || 100])
      .range([innerHeight, 0]);

    // Line generator
    const line = d3
      .line<ChartData>()
      .x((_: ChartData, i: number) => xScale(i))
      .y((d: ChartData) => yScale(d.value));

    // Path with animation
    const path = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3B82F6")
      .attr("stroke-width", 2)
      .attr("d", line);

    const pathLength = (path.node() as SVGPathElement)?.getTotalLength() || 0;

    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // X Axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style("font-size", "12px");

    // Y Axis
    g.append("g")
      .call(d3.axisLeft(yScale))
      .style("font-size", "12px");
  }, [data, width, height]);

  return svgRef;
};
