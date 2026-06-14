window.addEventListener("load", () => {
  const containerNode = d3.select("#eviction-chain-diagram").node();
  const width = containerNode.getBoundingClientRect().width;
  const height = 300;

  const tealFill = "#E1F5EE";
  const tealStroke = "#0F6E56";
  const purpleFill = "#EEEDFE";
  const purpleStroke = "#534AB7";
  const highlightFill = "#faeeda";
  const highlightStroke = "#BA7517";
  const textColor = "#1c1a17";
  const mutedColor = "#6b6255";
  const arrowColor = "#8b3a2a";

  const steps = [
    {
      desc: "Initial state. T₁: slot 0 → B, slot 1 → C. T₂: slot 0 → D. Inserting key A, which hashes to T₁ slot 0.",
      t1: ["B", "C", ""],
      t2: ["D", "", ""],
      evicting: null,
      arrow: null,
    },
    {
      desc: "T₁[slot 0] is occupied by B. Place A there and evict B. B now needs to go to its T₂ slot.",
      t1: ["A", "C", ""],
      t2: ["D", "", ""],
      evicting: { table: "t1", slot: 0 },
      arrow: { fromTable: "t1", fromSlot: 0, toTable: "t2", toSlot: 1 },
    },
    {
      desc: "B hashes to T₂ slot 1, which is empty. Place B there. Insertion succeeds.",
      t1: ["A", "C", ""],
      t2: ["D", "B", ""],
      evicting: { table: "t2", slot: 1 },
      arrow: null,
    },
  ];

  let currentStep = 0;

  const container = d3.select("#eviction-chain-diagram");

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("font-family", "'Source Serif 4', Georgia, serif");

  const defs = svg.append("defs");
  defs
    .append("marker")
    .attr("id", "evict-arrow")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 8)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M2 1L8 5L2 9")
    .attr("fill", "none")
    .attr("stroke", arrowColor)
    .attr("stroke-width", 1.5)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");

  const slotW = Math.min(160, width * 0.28);
  const slotH = 44;
  const slotGap = 12;
  const t1X = width * 0.05;
  const t2X = width * 0.67;
  const slotsY = [70, 70 + slotH + slotGap, 70 + 2 * (slotH + slotGap)];
  const numSlots = 3;

  svg
    .append("text")
    .attr("x", t1X + slotW / 2)
    .attr("y", 44)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "500")
    .attr("fill", tealStroke)
    .text("T₁");

  svg
    .append("text")
    .attr("x", t2X + slotW / 2)
    .attr("y", 44)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "500")
    .attr("fill", purpleStroke)
    .text("T₂");

  function slotCy(slot) {
    return slotsY[slot] + slotH / 2;
  }

  function drawSlots(step) {
    svg.selectAll(".slot-group").remove();
    svg.selectAll(".evict-arrow").remove();

    for (let i = 0; i < numSlots; i++) {
      const isHighlightT1 =
        step.evicting &&
        step.evicting.table === "t1" &&
        step.evicting.slot === i;
      const isHighlightT2 =
        step.evicting &&
        step.evicting.table === "t2" &&
        step.evicting.slot === i;

      const g1 = svg.append("g").attr("class", "slot-group");
      g1.append("rect")
        .attr("x", t1X)
        .attr("y", slotsY[i])
        .attr("width", slotW)
        .attr("height", slotH)
        .attr("rx", 4)
        .attr("fill", isHighlightT1 ? highlightFill : tealFill)
        .attr("stroke", isHighlightT1 ? highlightStroke : tealStroke)
        .attr("stroke-width", isHighlightT1 ? 1.5 : 0.5);
      g1.append("text")
        .attr("x", t1X + 10)
        .attr("y", slotsY[i] + slotH / 2)
        .attr("dominant-baseline", "central")
        .attr("font-size", "11px")
        .attr("fill", mutedColor)
        .text(`slot ${i}`);
      g1.append("text")
        .attr("x", t1X + slotW - 20)
        .attr("y", slotsY[i] + slotH / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "14px")
        .attr("font-weight", "500")
        .attr("fill", isHighlightT1 ? highlightStroke : tealStroke)
        .text(step.t1[i]);

      const g2 = svg.append("g").attr("class", "slot-group");
      g2.append("rect")
        .attr("x", t2X)
        .attr("y", slotsY[i])
        .attr("width", slotW)
        .attr("height", slotH)
        .attr("rx", 4)
        .attr("fill", isHighlightT2 ? highlightFill : purpleFill)
        .attr("stroke", isHighlightT2 ? highlightStroke : purpleStroke)
        .attr("stroke-width", isHighlightT2 ? 1.5 : 0.5);
      g2.append("text")
        .attr("x", t2X + 10)
        .attr("y", slotsY[i] + slotH / 2)
        .attr("dominant-baseline", "central")
        .attr("font-size", "11px")
        .attr("fill", mutedColor)
        .text(`slot ${i}`);
      g2.append("text")
        .attr("x", t2X + slotW - 20)
        .attr("y", slotsY[i] + slotH / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "14px")
        .attr("font-weight", "500")
        .attr("fill", isHighlightT2 ? highlightStroke : purpleStroke)
        .text(step.t2[i]);
    }

    if (step.arrow) {
      const x1 = t1X + slotW + 8;
      const y1 = slotCy(step.arrow.fromSlot);
      const x2 = t2X - 8;
      const y2 = slotCy(step.arrow.toSlot);
      const midX = (x1 + x2) / 2;

      svg
        .append("path")
        .attr("class", "evict-arrow")
        .attr("d", `M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}`)
        .attr("fill", "none")
        .attr("stroke", arrowColor)
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#evict-arrow)");

      svg
        .append("text")
        .attr("class", "evict-arrow")
        .attr("x", midX)
        .attr("y", (y1 + y2) / 2 - 8)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", arrowColor)
        .attr("font-style", "italic")
        .text("evict B →");
    }
  }

  const descBox = container
    .append("div")
    .style("font-size", "13px")
    .style("color", mutedColor)
    .style("font-style", "italic")
    .style("margin", "2px 0 6px")
    .style("min-height", "32px")
    .style("line-height", "1.5");

  const controls = container
    .append("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("justify-content", "center")
    .style("gap", "24px")
    .style("margin-top", "2px");

  const prevBtn = controls
    .append("button")
    .text("← Prev")
    .style("padding", "5px 14px")
    .style("font-size", "13px")
    .style("font-family", "'JetBrains Mono', monospace")
    .style("cursor", "pointer")
    .on("click", () => {
      if (currentStep > 0) {
        currentStep--;
        render();
      }
    });

  const stepLabel = controls
    .append("span")
    .style("font-size", "12px")
    .style("color", mutedColor)
    .style("font-family", "'JetBrains Mono', monospace");

  const nextBtn = controls
    .append("button")
    .text("Next →")
    .style("padding", "5px 14px")
    .style("font-size", "13px")
    .style("font-family", "'JetBrains Mono', monospace")
    .style("cursor", "pointer")
    .on("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        render();
      }
    });

  function render() {
    const s = steps[currentStep];
    drawSlots(s);
    descBox.text(s.desc);
    stepLabel.text(`step ${currentStep + 1} / ${steps.length}`);
    prevBtn.attr("disabled", currentStep === 0 ? true : null);
    nextBtn.attr("disabled", currentStep === steps.length - 1 ? true : null);
  }

  render();
});
