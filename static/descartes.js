// Crear un contenedor para el gráfico 3D con dimensiones iniciales
            const graphContainer = document.createElement('div');
            graphContainer.id = 'graph-container';
            responseDiv.appendChild(graphContainer);

            // Crear un canvas dentro del contenedor
            const canvas = document.createElement('canvas');
            canvas.id = 'renderCanvas';
            graphContainer.appendChild(canvas);

            // Crear el motor de Babylon.js con el canvas
            const engine = new BABYLON.Engine(canvas, true);
            const scene = new BABYLON.Scene(engine);

            // Fondo negro
            scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

            // Configurar la cámara
            const camera = new BABYLON.ArcRotateCamera(
                "camera",
                BABYLON.Tools.ToRadians(45),
                BABYLON.Tools.ToRadians(45),
                50,
                new BABYLON.Vector3(0, 0, 0),
                scene
            );
            camera.attachControl(canvas, true);

            // Añadir luz
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            // Añadir ejes de referencia
            const axesSize = 10;
            const makeAxis = (name, dir, color) => {
                const axis = BABYLON.MeshBuilder.CreateLines(
                    name,
                    { points: [BABYLON.Vector3.Zero(), dir.scale(axesSize)] },
                    scene
                );
                const axisMaterial = new BABYLON.StandardMaterial(name + "Mat", scene);
                axisMaterial.emissiveColor = color;
                axis.material = axisMaterial;
            };
            makeAxis("x", BABYLON.Axis.X, new BABYLON.Color3(1, 0, 0));
            makeAxis("y", BABYLON.Axis.Y, new BABYLON.Color3(0, 1, 0));
            makeAxis("z", BABYLON.Axis.Z, new BABYLON.Color3(0, 0, 1));

            // Función para calcular el producto
            function prod(coord, arista) {
                let result = 0;
                for (let k = 0; k < coord.length; k++) {
                    let result_temp = 0;
                    for (let ii = 0; ii < arista.length; ii++) {
                        for (let jj = 0; jj < arista[0].length; jj++) {
                            result_temp += arista[ii][jj] * aristas[k][ii][jj];
                        }
                    }
                    result_temp *= coord[k];
                    result += result_temp;
                }
                return result;
            }

            // Función sigmoide
            function sigmoid(z) {
                return 1 / (1 + Math.exp(-z));
            }

            // Crear un único cubo base
            const baseCube = BABYLON.MeshBuilder.CreateBox("baseCube", { size: 0.5 }, scene);
            baseCube.setEnabled(false); // Ocultar el cubo base

            // Crear instancias de cubos
            const cubeInstances = [];
            for (let i = 0; i < coords.length; i++) {
                const x = prod(coords[i], aristas[0]);
                const y = prod(coords[i], aristas[1]);
                const z = prod(coords[i], aristas[2]);

                // Normalizar los valores RGB al rango [0, 1]
                const r = sigmoid(prod(coords[i], aristas[3]));
                const g = sigmoid(prod(coords[i], aristas[4]));
                const b = sigmoid(prod(coords[i], aristas[5]));

                if (x === 0 && y === 0 && z === 0) continue;

                // Crear una instancia del cubo base
                const cubeInstance = baseCube.createInstance(`cubeInstance_${i}`);
                cubeInstance.position = new BABYLON.Vector3(x, y, z);

                // Asignar material y color
                const cubeMaterial = new BABYLON.StandardMaterial(`mat_${i}`, scene);
                cubeMaterial.emissiveColor = new BABYLON.Color3(r, g, b);
                cubeInstance.material = cubeMaterial;

                cubeInstances.push(cubeInstance);
            }

            // Ajustar el tamaño del canvas al contenedor
            const resizeObserver = new ResizeObserver(() => {
                canvas.width = graphContainer.offsetWidth;
                canvas.height = graphContainer.offsetHeight;
                engine.resize();
            });
            resizeObserver.observe(graphContainer);

            // Función de renderizado
            engine.runRenderLoop(() => {
                scene.render();
            });