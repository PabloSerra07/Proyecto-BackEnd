export function orderDTO(user, products) {
    const date = new Date().toLocaleString(); 

    function TotalPrice(products) {
      let total = 0;
    
      for (let i = 0; i < products.length; i++) {
        const priceString = products[i].price;
        const priceNumber = parseFloat(priceString);
    
        if (!isNaN(priceNumber)) {
          total += priceNumber;
        }
      }
    
      return total;
    }
    
    return {
        timestamp: date,
        user: {
          username: user.username,
          email: user.email,
          address: user.address,
          age: user.age,
          phone: user.phone_number,
          cartID: user.cartID,
          userID: user._id.toString(),
        },
        products: products,
        total: TotalPrice(products),
        status: "generated"
    }
}