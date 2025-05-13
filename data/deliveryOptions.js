export const deliveryOptions=[{
  id:'1',
  deliveryDays:7,
  priceCents:0
},{
  id:'2',
  deliveryDays:5,
  priceCents:499
},{
  id:'3',
  deliveryDays:3,
  priceCents:999
}];

export function getDeliveryOption(deliveryOptionId)
{
  let deliveryOption;
  deliveryOptions.forEach((option)=>
    {
      if (option.id === deliveryOptionId)
      {
        deliveryOption=option;
      }
    });
    return deliveryOption || deliveryOption[0];  // Here this is used to give it a default value i.e the first delivery option just in case we dont specify a delivery option.
}