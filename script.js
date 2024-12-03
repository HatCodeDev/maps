document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    const findPathButton = document.getElementById("findPath");
    const letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const size = 10; // Tamaño del tablero sin incluir los encabezados

    // Generar tablero
    for (let row = 0; row <= size + 1; row++) {
        for (let col = 0; col <= size + 1; col++) {
            const cell = document.createElement("div");

            if ((row === 0 && col === 0) || 
                (row === 0 && col === size + 1) || 
                (row === size + 1 && col === 0) || 
                (row === size + 1 && col === size + 1)) {
                cell.className = "cell empty";
            } else if (row === 0 && col <= size) {
                cell.className = "cell header";
                cell.textContent = letters[col];
            } else if (col === 0 && row <= size) {
                cell.className = "cell header";
                cell.textContent = row;
            } else if (row <= size && col === size + 1) {
                cell.className = "cell arrow";
                cell.textContent = row % 2 === 1 ? "→" : "←";
            } else if (col <= size && row === size + 1) {
                cell.className = "cell arrow";
                cell.textContent = col % 2 === 1 ? "↓" : "↑";
            } else {
                cell.className = "cell coordinate";
                cell.dataset.coordinate = `${letters[col]}${row}`;
            }

            board.appendChild(cell);
        }
    }

    // Validar coordenadas
    function toIndex(coordinate) {
        const regex = /^([A-J])(\d{1,2})$/i;
        const match = coordinate.match(regex);

        if (!match) {
            const output = document.getElementById("pathOutput");
            output.textContent = "⚠️ Por favor, ingresa una coordenada válida (Ejemplo: A1, J10)";
            output.style.color = "red";
            return null;
        }

        const letter = match[1].toUpperCase();
        const number = parseInt(match[2], 10);
        const col = letters.indexOf(letter);
        const row = number;

        return { row, col };
    }

    // Implementar BFS para encontrar el camino más corto
    function bfs(start, end) {
        const queue = [[start]];
        const visited = new Set();
        visited.add(`${start.row},${start.col}`);

        while (queue.length > 0) {
            const path = queue.shift();
            const { row, col } = path[path.length - 1];

            // Si llegamos al destino
            if (row === end.row && col === end.col) {
                return path;
            }

            // Movimientos válidos
            const moves = [];
            if (row % 2 === 1) moves.push([0, 1]); // Derecha en filas impares
            else moves.push([0, -1]); // Izquierda en filas pares

            if (col % 2 === 1) moves.push([1, 0]); // Abajo en columnas impares
            else moves.push([-1, 0]); // Arriba en columnas pares

            for (const [dRow, dCol] of moves) {
                const newRow = row + dRow;
                const newCol = col + dCol;

                if (
                    newRow >= 1 && newRow <= size &&
                    newCol >= 1 && newCol <= size &&
                    !visited.has(`${newRow},${newCol}`)
                ) {
                    visited.add(`${newRow},${newCol}`);
                    queue.push([...path, { row: newRow, col: newCol }]);
                }
            }
        }

        return []; // Camino no encontrado
    }

    // Resaltar camino
    function highlightPath(path) {
        const cells = document.querySelectorAll(".cell.coordinate");
        cells.forEach(cell => cell.classList.remove("path"));

        path.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-coordinate="${letters[col]}${row}"]`);
            if (cell) cell.classList.add("path");
        });
    }

    // Mostrar instrucciones
    function showPath(path) {
        const output = document.getElementById("pathOutput");
        if (path.length === 0) {
            output.textContent = "⚠️ No hay camino disponible.";
            output.style.color = "red";
        } else {
            const startCoord = `${letters[path[0].col]}${path[0].row}`;
            const endCoord = `${letters[path[path.length - 1].col]}${path[path.length - 1].row}`;

            let instructions = [`Desde ${startCoord} hasta ${endCoord}:`];
            let currentDirection = null;
            let currentCount = 0;

            for (let i = 1; i < path.length; i++) {
                const prev = path[i - 1];
                const current = path[i];

                const rowDiff = current.row - prev.row;
                const colDiff = current.col - prev.col;
                let newDirection = null;

                if (rowDiff > 0) {
                    newDirection = "calles hacia abajo";
                } else if (rowDiff < 0) {
                    newDirection = "calles hacia arriba";
                } else if (colDiff > 0) {
                    newDirection = "calles hacia la derecha";
                } else if (colDiff < 0) {
                    newDirection = "calles hacia la izquierda";
                }

                if (newDirection === currentDirection) {
                    currentCount++;
                } else {
                    if (currentDirection) {
                        instructions.push(`${currentCount} ${currentDirection}`);
                    }
                    currentDirection = newDirection;
                    currentCount = 1;
                }
            }

            if (currentDirection) {
                instructions.push(`${currentCount} ${currentDirection}`);
            }

            output.innerHTML = instructions.join(", ");
            output.style.color = "#2c3e50";
        }
    }

    // Encontrar camino
    findPathButton.addEventListener("click", () => {
        const start = toIndex(startInput.value);
        const end = toIndex(endInput.value);

        if (!start || !end) return;

        const path = bfs(start, end);
        highlightPath(path);
        showPath(path);
    });
});
