'use strict'
// main.js
import GastoCombustible from './gastosCom.js'; 
// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'components/tarifasCombustible.json';
let gastosJSONpath = 'components/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
   
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }
        let i = 0;
        while (i < gastosJSON.length) {
            const viaje = gastosJSON[i];
            const anio = new Date(viaje.date).getFullYear(); 
            const precioViaje = viaje.precioViaje;
    
            if (anio in aniosArray) {
                aniosArray[anio] += precioViaje; 

            }
            i++;
            
            const totalGastos = aniosArray[anio];
            document.getElementById(`gasto${anio}`).innerText=totalGastos.toFixed(2);
        }
          
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

   const anio = fecha.getFullYear();

   let gastoKm = 0;
  
   console.log("Tipo de vehículo seleccionado:", tipoVehiculo); 
   for (let i = 0; i < tarifasJSON.tarifas.length; i++) {
       if (tarifasJSON.tarifas[i].anio === anio) {
           gastoKm = tarifasJSON.tarifas[i].vehiculos[tipoVehiculo];
       }
   }

   const gastoTotal = kilometros * gastoKm;

  
   const nuevoGasto = {
       tipoVehiculo,
       fecha,
       kilometros,
       gastoTotal,
       convertToJSON: function() {
           return JSON.stringify({
               tipoVehiculo: this.tipoVehiculo,
               fecha: this.fecha.toISOString().split('T')[0], 
               kilometros: this.kilometros,
               gastoTotal: this.gastoTotal
           });
       }
   };

   
   const gastosRecientes = document.getElementById('expense-list');
   const li = document.createElement('li');
   li.innerText = nuevoGasto.convertToJSON(); 
   gastosRecientes.appendChild(li);

   

   const gastoAnterior = parseFloat(document.getElementById(`gasto${anio}`).textContent);
   const gastoActual = gastoTotal + gastoAnterior; 

   document.getElementById(`gasto${anio}`).innerText = gastoActual.toFixed(2);

   document.getElementById('fuel-form').reset();
}