<script lang="ts">
  interface DataPoint {
    label: string;
    value: number;
    maxValue: number;
  }

  interface ComparisonItem {
    name: string;
    color: string;
    data: DataPoint[];
  }

  interface Props {
    items: ComparisonItem[];
    size?: number;
    showLabels?: boolean;
    showLegend?: boolean;
  }

  let {
    items,
    size = 300,
    showLabels = true,
    showLegend = true
  }: Props = $props();

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 40;

  // Get all unique labels from first item
  const labels = items[0]?.data.map(d => d.label) || [];
  const numPoints = labels.length;
  const angleStep = (2 * Math.PI) / numPoints;

  function getPoint(index: number, value: number, maxValue: number): { x: number; y: number } {
    const angle = (index * angleStep) - (Math.PI / 2);
    const normalizedRadius = radius * (value / maxValue);
    return {
      x: centerX + normalizedRadius * Math.cos(angle),
      y: centerY + normalizedRadius * Math.sin(angle)
    };
  }

  function getLabelPoint(index: number): { x: number; y: number } {
    const angle = (index * angleStep) - (Math.PI / 2);
    const labelRadius = radius + 25;
    return {
      x: centerX + labelRadius * Math.cos(angle),
      y: centerY + labelRadius * Math.sin(angle)
    };
  }

  function getPolygonPath(item: ComparisonItem): string {
    return item.data
      .map((point, i) => {
        const { x, y } = getPoint(i, point.value, point.maxValue);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ') + ' Z';
  }

  // Generate grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1];
</script>

<div class="comparison-chart">
  <svg width={size} height={size} viewBox="0 0 {size} {size}">
    <!-- Grid circles -->
    {#each gridLevels as level}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * level}
        class="grid-circle"
        fill="none"
      />
    {/each}

    <!-- Axis lines -->
    {#each labels as _, i}
      {@const point = getPoint(i, 1, 1)}
      <line
        x1={centerX}
        y1={centerY}
        x2={point.x}
        y2={point.y}
        class="axis-line"
      />
    {/each}

    <!-- Data polygons -->
    {#each items as item, itemIndex}
      <path
        d={getPolygonPath(item)}
        class="data-polygon"
        style:fill={item.color}
        style:stroke={item.color}
        style:--delay="{itemIndex * 100}ms"
      />
    {/each}

    <!-- Data points -->
    {#each items as item}
      {#each item.data as point, i}
        {@const { x, y } = getPoint(i, point.value, point.maxValue)}
        <circle
          cx={x}
          cy={y}
          r="4"
          class="data-point"
          style:fill={item.color}
        />
      {/each}
    {/each}

    <!-- Labels -->
    {#if showLabels}
      {#each labels as label, i}
        {@const { x, y } = getLabelPoint(i)}
        <text
          x={x}
          y={y}
          class="axis-label"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {label}
        </text>
      {/each}
    {/if}
  </svg>

  {#if showLegend && items.length > 1}
    <div class="legend">
      {#each items as item}
        <div class="legend-item">
          <span class="legend-dot" style:background={item.color}></span>
          <span class="legend-label">{item.name}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .comparison-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
  }

  svg {
    overflow: visible;
  }

  .grid-circle {
    stroke: var(--wood-grain);
    stroke-width: 1;
    opacity: 0.5;
  }

  .axis-line {
    stroke: var(--wood-grain);
    stroke-width: 1;
    opacity: 0.3;
  }

  .data-polygon {
    fill-opacity: 0.2;
    stroke-width: 2;
    animation: polygon-draw 0.6s ease-out var(--delay, 0ms) both;
  }

  .data-point {
    stroke: var(--bg-card);
    stroke-width: 2;
  }

  .axis-label {
    fill: var(--brass-light);
    font-size: var(--text-xs);
    font-family: var(--font-display);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-md);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--bg-card);
  }

  .legend-label {
    font-size: var(--text-sm);
    color: var(--canvas);
  }

  @keyframes polygon-draw {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
