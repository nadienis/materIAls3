// Variables globales
const REPO_NAME = "materIAls3"; // ¡Cambia esto por el nombre de tu repositorio!
const MODEL_URL = `/${REPO_NAME}/model/model.json`; // Ruta absoluta

async function loadModel() {
    try {
        // Verifica que los archivos existan
        const response = await fetch(MODEL_URL);
        if (!response.ok) throw new Error("No se encontró model.json");
        
        // Carga el modelo
        model = await tf.loadGraphModel(MODEL_URL);
        console.log("Modelo cargado correctamente ✅");
    } catch (err) {
        console.error("Error:", err);
        alert("Error al cargar el modelo. Verifica la consola (F12).");
    }
}
let model;
const MODEL_URL = './model/model.json'; // Ruta relativa para GitHub Pages

// Cargar modelo con manejo de errores mejorado
async function loadModel() {
    try {
        document.getElementById('loading').style.display = 'block';
        
        // Verificar existencia de archivos
        const modelExists = await fetch(MODEL_URL).then(res => res.ok);
        const weightsExists = await fetch(MODEL_URL.replace('.json', '.weights.bin')).then(res => res.ok);
        
        if (!modelExists || !weightsExists) {
            throw new Error(`Archivos del modelo no encontrados. Verifica las rutas:
            - ${MODEL_URL}
            - ${MODEL_URL.replace('.json', '.weights.bin')}`);
        }

        model = await tf.loadGraphModel(MODEL_URL);
        console.log("Modelo cargado:", model);
        document.getElementById('loading').style.display = 'none';
        
    } catch (err) {
        console.error("Error al cargar el modelo:", err);
        document.getElementById('loading').innerHTML = `
            <p style="color: red;">Error al cargar el modelo:</p>
            <p>${err.message}</p>
            <p>Verifica la consola (F12) para detalles.</p>
        `;
    }
}

// Función de predicción
async function predict() {
    if (!model) {
        alert("Modelo no cargado. Por favor espera...");
        return;
    }

    const input1 = parseFloat(document.getElementById('input1').value);
    const input2 = parseFloat(document.getElementById('input2').value);
    
    const inputTensor = tf.tensor2d([[input1, input2]]);
    const prediction = await model.predict(inputTensor);
    const result = prediction.dataSync()[0];

    document.getElementById('prediction').textContent = `Predicción: ${result.toFixed(4)}`;
    inputTensor.dispose();
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    loadModel();
    document.getElementById('predict-btn').addEventListener('click', predict);
});
