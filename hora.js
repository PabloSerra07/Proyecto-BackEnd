function mostrarSaludo(){

    fecha = new Date(); 
    hora = fecha.getHours();

    if(hora >= 0 && hora < 12){
    texto = "Buenos Días";
    
    }

    if(hora >= 12 && hora < 18){
    texto = "Buenas Tardes";
    
    }

    if(hora >= 18 && hora < 24){
    texto = "Buenas Noches";
    
    }}