export function userDTO(userData){

    const {name, email, hashedPassword, address, age, phone_number, image} = userData

    return{
        username: name,
        email,
        password: hashedPassword,
        address,
        age,
        phone_number,
        image,
        cartID: ""
    }
}