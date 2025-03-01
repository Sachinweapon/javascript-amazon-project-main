export const cart=[];

export function addtocart(productId)
{
  let matchingitem;
  const quantitySelector=document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity=Number(quantitySelector.value);
  cart.forEach((cartItem)=>{
    if(productId===cartItem.productId)
    {
      matchingitem=cartItem;
    }
  });
  if(matchingitem)
  {
    matchingitem.quantity+=quantity;
  }
  else{
    cart.push({
      productId: productId,
      quantity:quantity
    });
  }
}
