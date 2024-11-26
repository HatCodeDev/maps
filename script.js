document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    const findPathButton = document.getElementById("findPath");
    const letters = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const size = 10; // Tamaño del tablero sin incluir los encabezados
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1]  // Movimientos: arriba, abajo, izquierda, derecha
    ];

    // Crear el tablero
    for (let row = 0; row <= size; row++) {
        for (let col = 0; col <= size; col++) {
            const cell = document.createElement("div");

            if (row === 0 && col === 0) {
                // Esquina superior izquierda vacía
                cell.className = "cell empty";
            } else if (row === 0) {
                // Encabezado superior (letras)
                cell.className = "cell header";
                cell.textContent = letters[col];
            } else if (col === 0) {
                // Encabezado lateral izquierdo (números)
                cell.className = "cell header";
                cell.textContent = row;
            } else {
                // Celdas del tablero (coordenadas)
                cell.className = "cell coordinate";
                cell.dataset.coordinate = `${letters[col]}${row}`; // Ejemplo: A1, B2
            }

            board.appendChild(cell);
        }
    }

    // Convertir coordenadas de letras y números a índices
    function toIndex(coordinate) {
        const letter = coordinate.charAt(0).toUpperCase();
        const number = parseInt(coordinate.charAt(1), 10);
        const col = letters.indexOf(letter);
        const row = number;
        return { row, col };
    }

    // Función BFS para encontrar el camino más corto
    function bfs(start, end) {
        const queue = [[start]];
        const visited = new Set();
        visited.add(`${start.row},${start.col}`);
        const path = [];

        while (queue.length > 0) {
            const currentPath = queue.shift();
            const { row, col } = currentPath[currentPath.length - 1];

            if (row === end.row && col === end.col) {
                return currentPath;
            }

            for (const [dRow, dCol] of directions) {
                const newRow = row + dRow;
                const newCol = col + dCol;

                if (
                    newRow >= 1 && newRow <= size &&
                    newCol >= 1 && newCol <= size &&
                    !visited.has(`${newRow},${newCol}`)
                ) {
                    visited.add(`${newRow},${newCol}`);
                    queue.push([...currentPath, { row: newRow, col: newCol }]);
                }
            }
        }

        return path; // Si no hay camino
    }

    // Función para destacar el camino en el tablero
    function highlightPath(path) {
        const cells = document.querySelectorAll(".cell.coordinate");
        cells.forEach(cell => cell.classList.remove("path"));

        path.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-coordinate="${letters[col]}${row}"]`);
            if (cell) {
                cell.classList.add("path");
            }
        });
    }

    // Función para mostrar el camino
    function showPath(path) {
        const output = document.getElementById("pathOutput");
        if (path.length === 0) {
            output.textContent = "No hay camino disponible.";
        } else {
            const pathText = path.map(({ row, col }) => `${letters[col]}${row}`).join(" -> ");
            output.textContent = `Camino más corto: ${pathText}`;
        }
    }

    // Lógica al presionar el botón
    findPathButton.addEventListener("click", () => {
        const start = toIndex(startInput.value);
        const end = toIndex(endInput.value);
        
        const path = bfs(start, end);
        highlightPath(path);
        showPath(path);
    });
});
