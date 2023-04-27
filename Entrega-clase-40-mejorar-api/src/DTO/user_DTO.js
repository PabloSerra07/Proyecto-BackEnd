export function userDTO(
    name, 
    email, 
    hashedPassword, 
    address, 
    age, 
    phone_number, 
    imagen)
    {

    return{
        username: name,
        email,
        password: hashedPassword,
        address,
        age,
        phone_number,
        imagen,
        cartID: ""
    }
}