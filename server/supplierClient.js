export async function fetchSupplierProducts() {
  return [
    { sku:"sku1", title:"T-shirt", description:"Cotton T-shirt", price:500 },
    { sku:"sku2", title:"Shoes", description:"Running shoes", price:1500 },
    { sku:"sku3", title:"Backpack", description:"Stylish backpack", price:1200 }
  ];
}

export async function placeSupplierOrder(order) {
  return { supplierOrderId: "SUP-" + Math.floor(Math.random()*100000), status:"confirmed" };
}
