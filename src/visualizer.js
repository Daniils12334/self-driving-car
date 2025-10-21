class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop =
                top +
                lerp(
                    height - levelHeight,
                    0,
                    network.levels.length === 1
                        ? 0.5
                        : i / (network.levels.length - 1)
                );

            Visualizer.drawLevel(
                ctx,
                network.levels[i],
                left,
                levelTop,
                width,
                levelHeight,
                i === network.levels.length - 1 ? ['🡑', '🡐', '🡒', '🡓'] : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const { inputs, outputs, weights, biases } = level;

        // Соединения
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = Visualizer.#getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // Входные нейроны
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, 18, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, 15, 0, Math.PI * 2);
            ctx.fillStyle = Visualizer.#getRGBA(inputs[i]);
            ctx.fill();
        }

        // Выходные нейроны
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, 18, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, 15, 0, Math.PI * 2);
            ctx.fillStyle = Visualizer.#getRGBA(outputs[i]);
            ctx.fill();

            // Смещение (bias)
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.arc(x, top, 20, 0, Math.PI * 2);
            ctx.strokeStyle = Visualizer.#getRGBA(biases[i]);
            ctx.stroke();

            if (outputLabels[i]) {
                ctx.fillStyle = "white";
                ctx.font = "15px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(outputLabels[i], x, top);
            }
        }
    }

    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
        );
    }

    static #getRGBA(value) {
        const alpha = Math.abs(value);
        const color = value < 0 ? 255 : 0;
        return `rgba(${color},${color},255,${alpha})`;
    }
}
