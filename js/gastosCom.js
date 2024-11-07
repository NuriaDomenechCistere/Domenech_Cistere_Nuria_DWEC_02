class GastoCombustible {
    constructor(vehicleType, date, kilometers) {
        this.vehicleType = vehicleType;
        this.date = date;
        this.kilometers = kilometers;
        this.precioViaje = 0;
    }
  
    // Método para convertir el objeto a JSON
    convertToJSON() {
        return JSON.stringify(GastoCombustible);
    }
}
export default GastoCombustible;