window.addEventListener("load", () => {
  const containerNode = d3.select("#cuckoo-graph-diagram").node();
  const width = containerNode.getBoundingClientRect().width;
  const height = 360;

  const tealFill = "#E1F5EE";
  const tealStroke = "#0F6E56";
  const purpleFill = "#EEEDFE";
  const purpleStroke = "#534AB7";

  const baseEdgeColor = "#1D9E75";
  const insertedEdgeColor = "#D97706";

  const textColor = "#1c1a17";
  const mutedColor = "#6b6255";

  const svg = d3
    .select("#cuckoo-graph-diagram")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "'Source Serif 4', Georgia, serif");

  const panelWidth = width / 2;
  const nodeR = 20;
  const t1x = panelWidth * 0.22;
  const t2x = panelWidth * 0.67;
  const yStart = 90;
  const yGap = 70;

  function drawPanel(g, offsetX, nodes1, nodes2, edges, caption, label) {
    g.append("text")
      .attr("x", offsetX + (t2x - t1x) / 2 + t1x)
      .attr("y", 22)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("font-weight", "500")
      .attr("fill", textColor)
      .text(label);

    g.append("text")
      .attr("x", offsetX + (t2x - t1x) / 2 + t1x)
      .attr("y", 38)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", mutedColor)
      .text(caption);

    g.append("text")
      .attr("x", offsetX + t1x)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", tealStroke)
      .text("T₁ slots");

    g.append("text")
      .attr("x", offsetX + t2x)
      .attr("y", 55)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", purpleStroke)
      .text("T₂ slots");

    edges.forEach(([i, j, edgeColor, curveOffset]) => {
      const x1 = offsetX + t1x + nodeR;
      const y1 = yStart + i * yGap;
      const x2 = offsetX + t2x - nodeR;
      const jY = j !== undefined ? j : i;
      const y2 = yStart + jY * yGap;

      const angle = Math.atan2(y2 - y1, x2 - x1);

      let pathD;
      if (curveOffset) {
        const cx = (x1 + x2) / 2 - Math.sin(angle) * curveOffset;
        const cy = (y1 + y2) / 2 + Math.cos(angle) * curveOffset;
        pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
      } else {
        pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
      }

      g.append("path")
        .attr("d", pathD)
        .attr("fill", "none")
        .attr("stroke", edgeColor)
        .attr("stroke-width", 1.8)
        .attr("opacity", 0.9);
    });

    nodes1.forEach((label, i) => {
      const cx = offsetX + t1x;
      const cy = yStart + i * yGap;
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", nodeR)
        .attr("fill", tealFill)
        .attr("stroke", tealStroke)
        .attr("stroke-width", 1);
      g.append("text")
        .attr("x", cx)
        .attr("y", cy)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "12px")
        .attr("fill", tealStroke)
        .text(label);
    });

    nodes2.forEach((label, i) => {
      const cx = offsetX + t2x;
      const cy = yStart + i * yGap;
      g.append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", nodeR)
        .attr("fill", purpleFill)
        .attr("stroke", purpleStroke)
        .attr("stroke-width", 1);
      g.append("text")
        .attr("x", cx)
        .attr("y", cy)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "12px")
        .attr("fill", purpleStroke)
        .text(label);
    });
  }

  const leftG = svg.append("g");
  const rightG = svg.append("g");

  // FIXED: Added [2, 2] edge. Now has 6 edges and 6 nodes (1 perfect closed cycle)
  drawPanel(
    leftG,
    0,
    ["0", "1", "2"],
    ["0", "1", "2"],
    [
      [0, 0, baseEdgeColor],
      [1, 0, baseEdgeColor],
      [1, 1, baseEdgeColor],
      [2, 1, baseEdgeColor],
      [2, 2, baseEdgeColor],
      [0, 2, baseEdgeColor],
    ],
    "one cycle — valid",
    "Valid component",
  );

  svg
    .append("line")
    .attr("x1", panelWidth)
    .attr("y1", 20)
    .attr("x2", panelWidth)
    .attr("y2", height - 75)
    .attr("stroke", "#d6cfc4")
    .attr("stroke-width", 0.5)
    .attr("stroke-dasharray", "4 4");

  // FIXED: Now contains 7 edges over 6 nodes, forcing a true double-cycle failure
  drawPanel(
    rightG,
    panelWidth,
    ["0", "1", "2"],
    ["0", "1", "2"],
    [
      [0, 0, baseEdgeColor],
      [1, 0, baseEdgeColor],
      [1, 1, baseEdgeColor],
      [2, 1, baseEdgeColor],
      [2, 2, baseEdgeColor],
      [0, 2, baseEdgeColor],
      [0, 1, insertedEdgeColor, 18], // The 7th insertion edge that breaks the system
    ],
    "two cycles — no valid placement",
    "Invalid component",
  );

  svg
    .append("line")
    .attr("x1", 30)
    .attr("y1", height - 60)
    .attr("x2", width - 30)
    .attr("y2", height - 60)
    .attr("stroke", "#eee1d4")
    .attr("stroke-width", 1);

  const footerText = svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 38)
    .attr("text-anchor", "middle")
    .attr("font-size", "11.5px")
    .attr("fill", insertedEdgeColor)
    .attr("font-weight", "600");

  footerText
    .append("tspan")
    .attr("x", width / 2)
    .text(
      "The newly inserted connection (highlighted in orange) introduces a double cycle inside the component,",
    );

  footerText
    .append("tspan")
    .attr("x", width / 2)
    .attr("dy", "16px")
    .text("making a successful slot placement mathematically impossible.");
});
