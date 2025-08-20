const OrderDetail = () => {
return (
<div class=" mx-auto bg-white shadow rounded p-6">
 
  <h2 class="text-lg font-semibold mb-4">Estimate Summary</h2>

 
  <div class="space-y-3">
    <div class="flex justify-between p-2">
      <span>Haldi Carnival Total</span>
      <span>₹15,000.00</span>
    </div>
    <hr class="border-t border-gray-300 my-2" />
    <div class="flex justify-between p-2">
      <span>Mayra Groom Side</span>
      <span>₹25,000.00</span>
    </div>
    <hr class="border-t border-gray-300 my-2" />
    <div class="flex justify-between p-2">
      <span>Wedding Reception Total</span>
      <span>₹60,000.00</span>
    </div>

  
       <hr class="border-t border-dashed border-gray-300 my-2" />   

    <div class="flex justify-between">
      <span class="font-medium">Subtotal</span>
      <span class="font-medium">₹1,00,000.00</span>
    </div>

   
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
      
        <span>Discount</span>
      </div>
     
      <span class="text-red-500 font-medium">  
          <input
          type="number"
       
          readonly
          class="w-14 text-center border rounded bg-gray-100 text-xs py-1 me-2"
        />
         <input
    type="number"
  
    class="w-24 border rounded text-sm px-2 py-1"
  />
        </span>
    </div>

   
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
       
        <span>CGST</span>
      </div>
      <span>  <input
          type="number"
          
          readonly
          class="w-14 text-center border rounded bg-gray-100 text-xs py-1 me-2"
        />
         <input
    type="number"
    placeholder="0"
    class="w-24 border rounded text-sm px-2 py-1"
  />
        </span>
    </div>

   
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
       
        <span>SGST</span>
      </div>
      <span class="flex items-center gap-2">
  
  <input
    type="number    "

    readonly
    class="w-14 text-center border rounded bg-gray-100 text-xs py-1"
  />

  
  <input
    type="number"
    placeholder="0"
    class="w-24 border rounded text-sm px-2 py-1"
  />
</span>

    </div>
  </div>

  
  <div class="mt-6 bg-orange-50 p-3 flex justify-between font-semibold text-orange-700 rounded">
    <span>Grand Total</span>
    <span>₹1,06,200.00</span>
  </div>
</div>


);
};

export default OrderDetail;
