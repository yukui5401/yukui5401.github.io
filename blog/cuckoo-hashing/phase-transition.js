window.addEventListener("load", () => {
  const margin = { top: 40, right: 40, bottom: 60, left: 60 };
  const containerNode = d3.select("#phase-transition-diagram").node();
  const totalWidth = containerNode.getBoundingClientRect().width;
  const width = totalWidth - margin.left - margin.right;
  const height = 340 - margin.top - margin.bottom;

  const textColor = "#1c1a17";
  const mutedColor = "#6b6255";
  const validColor = "#1D9E75";
  const invalidColor = "#E24B4A";
  const accentColor = "#8b3a2a";

  const svgEl = d3
    .select("#phase-transition-diagram")
    .append("svg")
    .attr("width", totalWidth)
    .attr("height", height + margin.top + margin.bottom)
    .style("font-family", "'Source Serif 4', Georgia, serif");

  const svg = svgEl
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3.scaleLinear().domain([0, 2]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

  const criticalAlpha = 1.0;
  const recommendedAlpha = 0.5;
  const criticalX = xScale(criticalAlpha);
  const recommendedX = xScale(recommendedAlpha);

  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", criticalX)
    .attr("height", height)
    .attr("fill", validColor)
    .attr("opacity", 0.07);

  svg
    .append("rect")
    .attr("x", criticalX)
    .attr("y", 0)
    .attr("width", width - criticalX)
    .attr("height", height)
    .attr("fill", invalidColor)
    .attr("opacity", 0.07);

  svg
    .append("text")
    .attr("x", criticalX / 2)
    .attr("y", 16)
    .attr("text-anchor", "middle")
    .attr("font-size", "11px")
    .attr("fill", "#0F6E56")
    .text("subcritical");

  svg
    .append("text")
    .attr("x", criticalX + (width - criticalX) / 2)
    .attr("y", 16)
    .attr("text-anchor", "middle")
    .attr("font-size", "11px")
    .attr("fill", "#A32D2D")
    .text("supercritical");

  const xAxis = d3.axisBottom(xScale).ticks(5).tickSize(4);
  const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(4);

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("font-size", "11px")
    .attr("fill", mutedColor);
  svg
    .append("g")
    .call(yAxis)
    .selectAll("text")
    .attr("font-size", "11px")
    .attr("fill", mutedColor);

  svg.selectAll(".domain").attr("stroke", "#d6cfc4");
  svg.selectAll(".tick line").attr("stroke", "#d6cfc4");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + 48) // Nudged down slightly for breathing room
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", mutedColor)
    .text("load factor α = n/m");

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -46)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", mutedColor)
    .text("failure probability");

  function sigmoidFailure(alpha) {
    return 1 / (1 + Math.exp(-14 * (alpha - 1.0)));
  }

  const lineData = d3
    .range(0, 2.01, 0.01)
    .map((a) => ({ alpha: a, p: sigmoidFailure(a) }));

  const lineGen = d3
    .line()
    .x((d) => xScale(d.alpha))
    .y((d) => yScale(d.p))
    .curve(d3.curveCatmullRom);

  svg
    .append("path")
    .datum(lineData)
    .attr("fill", "none")
    .attr("stroke", accentColor)
    .attr("stroke-width", 2)
    .attr("d", lineGen);

  svg
    .append("line")
    .attr("x1", criticalX)
    .attr("y1", 0)
    .attr("x2", criticalX)
    .attr("y2", height)
    .attr("stroke", textColor)
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "4 3")
    .attr("opacity", 0.5);

  // ADJUSTMENT 1: Perfectly centered critical line label, lowered below standard tick mark text
  const alphaLabel = svg
    .append("text")
    .attr("x", criticalX)
    .attr("y", height + 32)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "500")
    .attr("fill", textColor);
  alphaLabel.append("tspan").text("α");
  alphaLabel.append("tspan").attr("dy", "3").attr("font-size", "9px").text("c");
  alphaLabel.append("tspan").attr("dy", "-3").text(" = 1");

  svg
    .append("line")
    .attr("x1", recommendedX)
    .attr("y1", 0)
    .attr("x2", recommendedX)
    .attr("y2", height)
    .attr("stroke", validColor)
    .attr("stroke-width", 1)
    .attr("stroke-dasharray", "3 3")
    .attr("opacity", 0.7);

  // ADJUSTMENT 2: Moved α = 0.5 tag up into the empty plot space to eliminate footer clutter
  svg
    .append("text")
    .attr("x", recommendedX - 8)
    .attr("y", height * 0.4)
    .attr("text-anchor", "end")
    .attr("font-size", "11px")
    .attr("font-weight", "500")
    .attr("fill", validColor)
    .text("α = 0.5");

  svg
    .append("text")
    .attr("x", recommendedX - 8)
    .attr("y", height * 0.4 + 14)
    .attr("text-anchor", "end")
    .attr("font-size", "11px")
    .attr("fill", validColor)
    .text("(recommended)");

  const dotP = sigmoidFailure(recommendedAlpha);
  svg
    .append("circle")
    .attr("cx", xScale(recommendedAlpha))
    .attr("cy", yScale(dotP))
    .attr("r", 5)
    .attr("fill", validColor)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5);

  const tooltip = d3
    .select("#phase-transition-diagram")
    .append("div")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "#fff")
    .style("border", "0.5px solid #d6cfc4")
    .style("border-radius", "4px")
    .style("padding", "5px 10px")
    .style("font-size", "12px")
    .style("color", textColor)
    .style("font-family", "'JetBrains Mono', monospace")
    .style("opacity", 0);

  const hoverLine = svg
    .append("line")
    .attr("stroke", "#d6cfc4")
    .attr("stroke-width", 0.5)
    .attr("y1", 0)
    .attr("y2", height)
    .style("opacity", 0);

  const hoverDot = svg
    .append("circle")
    .attr("r", 4)
    .attr("fill", accentColor)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .style("opacity", 0);

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mousemove", function (event) {
      const [mx] = d3.pointer(event);
      const alpha = xScale.invert(mx);
      if (alpha < 0 || alpha > 2) return;
      const p = sigmoidFailure(alpha);
      hoverLine.attr("x1", mx).attr("x2", mx).style("opacity", 1);
      hoverDot.attr("cx", mx).attr("cy", yScale(p)).style("opacity", 1);
      tooltip
        .style("opacity", 1)
        .style("left", mx + margin.left + 12 + "px")
        .style("top", yScale(p) + margin.top - 20 + "px")
        .html(`α = ${alpha.toFixed(3)}<br>p ≈ ${(p * 100).toFixed(3)}%`);
    })
    .on("mouseleave", function () {
      hoverLine.style("opacity", 0);
      hoverDot.style("opacity", 0);
      tooltip.style("opacity", 0);
    });

  d3.select("#phase-transition-diagram").style("position", "relative");
});
