export function productosDTO(data){

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const date = new Date().toLocaleString()
    
    return{
        ...data,
        code: random(1, 9999).toString(),
        timestamp: date,
    }
}