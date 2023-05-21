import {serve} from 'https://deno.land/std@0.155.0/http/server.ts'; // --> devuelve una promise
//---------------------------------------
//Como no estamos en la raiz del fichero, ts, en el que estamos trabajando, el await(de Deno),(tiene un ambito que es el handler), por eso tenemos que colocar el async, dentro del handler, para definir lo que estamos devolviendo. Entonces dentro del handler, YA NO DEVOLVEMOS una response, sino una PROMISE.

//Y esta promise devuelve una response.  
// Esto sucede, por que a cualquier funcion que le colocamos un async delante, èsta devuelve una promise.

const listaColores: string[] = [];  // para acceder al elem, en un [], en Ts, --> let colores: string = [3]--> indice del color


//await serve(): devuelve un handler(func, manejadora), que maneja todas las peticiones http
    const handler = async (req: Request): Promise <Response> =>{

    const { pathname } = new URL(req.url);  // pathname(propiedad) 
    const conte = await Deno.readFile('./public/html/index.html');  
    // todas las func de Deno devuelven una promise. ---> arriba por eso va el await
    //console.log(pathname);  // = es la ruta en la que estamos navegando
    
    //------------------ HTML -----------------
    if(req.method === 'GET') { 
        //----------- vemos la lista de colores --------------
        
        //const idColor = document.getElementById('idColor');
        //listaColor.push(idColor)
        //----????? -----
        //----------------------------------------------------
    // aca, en vez de devolver un texto:(welcome...), devolvemos un file(conte)= al html.
    if(pathname === '/'){ 
        return new Response(conte, {status:200, headers: {'Content-Type': 'text/html; charset= utf-8'}
    //-----------------------------------------
                });
    //----------------- CSS  ----------------
                    //aca compara si en la ruta pedimos cualquier file que termine en css.
                    //usamos EXPRESIONES REGULARES --> /.ccs$/
            } else if( pathname.match(/.css$/) ){  
                    const conte = await Deno.readFile(`./public/${pathname}`); // --> file HTML, CSS, o Js(en este caso css)
            // too debemos avisar al usuario. Esto se hace en las cabeceras(headers)
                    return new Response(conte, { status:200, headers: { 'Content-Type': 'text/css' } });
    //---------------------------------------
        
            } else {
                 return new Response('Not Found', {status:404}); }
                } else if( req.method === 'POST' ){ 
                    const body = await req.text(); // ---> nos devuelve el color
                    console.log('Seleccionaron el', body);
                
                    if(body === ''){ listaColores.push(body); } 
                
                    return new Response(body, { status: 200 })
                         
                    } else { return new Response('Metodo no soportado', { status: 500 }) 
                    }}
                

await serve(handler, { port: 8060 });   //ejecutar: ---> deno run --allow-net index.ts / o: denon run --allow-net index.ts

