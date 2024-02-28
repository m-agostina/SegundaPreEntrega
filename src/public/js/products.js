// botones de Agregar al carrito
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn')

// Iteracion sobre cada boton
addToCartButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
        const productId = event.target.dataset.productId
        try {
           // agregar producto al carrito
            const response = await fetch(`/api/carts/65ca8329a0c20b976667c2b5/product/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: 1 
                })
            })
            
            if (response.ok) {
                alert('Producto agregado al carrito correctamente.')
            } else {
                alert('Hubo un error al agregar el producto al carrito.')
            }
           console.log(response)
        } catch (error) {
            console.error('Error:', error)
            alert('Hubo un error al agregar el producto al carrito.')
        }
    })
})
