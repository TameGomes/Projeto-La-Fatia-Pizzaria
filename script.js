let cart = [];
let qtModal = 1;
let modalKey = 0;
let size =  document.querySelector('.pizzaInfo--size').getAttribute('data-key');

pizzaJson.map((item, index)=>{

 //Clonando o modelo que apresenta a pizza
 let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

 //Preenchendo as informações em pizzaItem
 document.querySelector('.pizza-area').append (pizzaItem);

 //Adcionando as informações da Pizza no site
 pizzaItem.setAttribute('data-key', index);
 pizzaItem.querySelector('.pizza-item--img img').src = item.img;
 pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
 pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
 pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

 //Abrindo modal ao clicar no botão + ou na img da pizza
 pizzaItem.querySelector('a').addEventListener('click', (e)=>{
    e.preventDefault();
    
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    qtModal = 1;
    modalKey = key;

    //Mostrando o nome da pizza clicada
    document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    //Mostrando a descrição da pizza clicada
    document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    //Mostrando a imagem da pizza clicada
    document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
    //Mostrando o preço da pizza clicada
    document.querySelector('.pizzaInfo--price').innerHTML = (`R$ ${pizzaJson[key].price}`)
    //Removendo a classe que faz com que o último tamanho clicado apareça no modal de outra pizza
    document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
    //Mostrando os tamanhos de cada pizza (por pedaço)
    document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {

        if (sizeIndex == 2) {
            size.classList.add('selected');
        }
         
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    
    document.querySelector('.pizzaInfo--qt').innerHTML = qtModal;
    
    //Criando animação de surgimento do modal
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    document.querySelector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=> {

        document.querySelector('.pizzaWindowArea').style.opacity = 1;
    }, 200);
    
 })

})

//Fechando o Modal
function closeModal() {

    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=> {
            
        document.querySelector('.pizzaWindowArea').style.display = 'none';
    }, 200);
   
}

//Adicionando mais pizzas
function adicionarItem() {
    
    qtModal++;
    let key = document.querySelector('.pizzaInfo--price').getAttribute('data-key');
    let pizzaItem = pizzaJson.find((item)=> item.id == pizzaJson[modalKey].id);
    let price = pizzaItem.price * qtModal;
    document.querySelector('.pizzaInfo--price').innerHTML = `R$ ${price.toFixed(2)}`;
    document.querySelector('.pizzaInfo--qt').innerHTML = qtModal;
}

//Removendo pizzas adicionadas
function removerItem() {
    if (qtModal <= 1) {
       closeModal()
    }
  

    qtModal--;
    let key = document.querySelector('.pizzaInfo--price').getAttribute('data-key');
    let pizzaItem = pizzaJson.find((item)=> item.id == pizzaJson[modalKey].id);
    let price = pizzaItem.price * qtModal;
    document.querySelector('.pizzaInfo--price').innerHTML = `R$ ${price.toFixed(2)}`;
    document.querySelector('.pizzaInfo--qt').innerHTML = qtModal;
}

//Removendo o tamanho selecionado anteriormente, caso outro tamanho seja selecionado
document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener ('click', (e) => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//Colocando informações no carrinho
document.querySelector('.pizzaInfo--addButton').addEventListener ('click', () => {

   let size =  parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));

   let identifier =  pizzaJson[modalKey].id + '-' + size;

   let key = cart.findIndex((item) =>item.identifier == identifier);

      if (key > -1) {
        cart[key].qt += qtModal;
      }

      else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:qtModal
        });
      }
        updateCart();
        closeModal();
    });

//Abrir carrinho em dispositivos menores 

document.querySelector('.menu-openner span').addEventListener('click', () => {

    if (cart.length < 1) {
        document.querySelector('aside').style.left = 1;
    }

    else {
        document.querySelector('aside').style.left = 0;
    }

});


document.querySelector('.menu-closer').addEventListener('click', () => {

    document.querySelector('aside').style.left = '100vw';
})

//Função para mostrar o carrinho com os itens selecionados
     function updateCart() {
        document.querySelector('.menu-openner span').innerHTML = cart.length;

        if (cart.length > 0) {
            document.querySelector('aside').classList.add('show');
            document.querySelector('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for (let i in cart) {
            
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = document.querySelector('.models .cart--item').cloneNode(true);

            
            let pizzaSizeName;
            switch (cart[i].size){
                  case 0:
                    pizzaSizeName = 'Pequena';
                    break;

                 case 1:
                    pizzaSizeName = 'Média';
                    break;

                case 2:
                    pizzaSizeName = 'Grande';
                    break;
            }

            pizzaName = `${pizzaItem.name}  (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                   if (cart[i].qt > 1) {
                    cart[i].qt--;
                   }
                   else {
                    cart.splice(i, 1);
                   }
                   updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                   cart[i].qt++;
                   updateCart();
            });


            document.querySelector('.cart').append(cartItem);

        }
        
     //Calculando e mostrando na tela os valores (Total, Subtotal e Desconto)
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        document.querySelector('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

   //Fechando o carrinho, caso sejam removidos todos os itens do carrinho
         }  else {
             document.querySelector('aside').classList.remove('show');
             document.querySelector('aside').style.left = '100vw';
            }
        
        }

    


