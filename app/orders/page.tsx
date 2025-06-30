"use client";

import React, { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  name: string;
  price: number;
  store: string;
  measurement_value: number;
  measurement_type: string;
}

interface Recipe {
  id: number;
  name: string;
  totalCost: number;
  ingredients: Array<{
    id: number;
    name: string;
    quantity: number;
    measurement_type: string;
  }>;
}

interface OrderItem {
  id: number;
  name: string;
  type: 'recipe' | 'ingredient';
  quantity: number;
  price: number;
  unitPrice: number;
}

const OrderForm: React.FC = () => {
  // State for order
  const [orderName, setOrderName] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  //State for labor costs and profit margin
  const [laborCost, setLaborCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0.4);
  
  // State for available items and selected items
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [availableRecipes, setAvailableRecipes] = useState<Recipe[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // State for current selection
  const [selectedType, setSelectedType] = useState<'recipe' | 'ingredient'>('ingredient');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  //State for popup window for submission
  const[showPopup, setShowPopup] = useState(false);

  // Fetch available ingredients and recipes
  useEffect(() => {
    // Filler data until I connect database
    const mockIngredients: Ingredient[] = [
      { id: 1, name: 'Flour', price: 2.99, store: 'Grocery Store', measurement_value: 1000, measurement_type: 'g' },
      { id: 2, name: 'Sugar', price: 3.49, store: 'Grocery Store', measurement_value: 500, measurement_type: 'g' },
      { id: 3, name: 'Butter', price: 4.99, store: 'Grocery Store', measurement_value: 250, measurement_type: 'g' },
      { id: 4, name: 'Eggs', price: 3.99, store: 'Grocery Store', measurement_value: 12, measurement_type: 'unit' },
      { id: 5, name: 'Milk', price: 2.79, store: 'Grocery Store', measurement_value: 1000, measurement_type: 'ml' },
    ];
    
    // Filler data until I connect database
    const mockRecipes: Recipe[] = [
      { 
        id: 1, 
        name: 'Chocolate Cake', 
        totalCost: 12.99,
        ingredients: [
          { id: 1, name: 'Flour', quantity: 250, measurement_type: 'g' },
          { id: 2, name: 'Sugar', quantity: 200, measurement_type: 'g' },
          { id: 3, name: 'Butter', quantity: 100, measurement_type: 'g' },
        ] 
      },
      { 
        id: 2, 
        name: 'Pancakes', 
        totalCost: 6.50,
        ingredients: [
          { id: 1, name: 'Flour', quantity: 150, measurement_type: 'g' },
          { id: 2, name: 'Sugar', quantity: 50, measurement_type: 'g' },
          { id: 4, name: 'Eggs', quantity: 2, measurement_type: 'unit' },
          { id: 5, name: 'Milk', quantity: 200, measurement_type: 'ml' },
        ] 
      },
      { 
        id: 3, 
        name: 'Butter Cookies', 
        totalCost: 8.25,
        ingredients: [
          { id: 1, name: 'Flour', quantity: 200, measurement_type: 'g' },
          { id: 2, name: 'Sugar', quantity: 100, measurement_type: 'g' },
          { id: 3, name: 'Butter', quantity: 150, measurement_type: 'g' },
        ] 
      },
    ];
    
    setAvailableIngredients(mockIngredients);
    setAvailableRecipes(mockRecipes);
  }, []);

  // Add item to order
  const addItemToOrder = () => {
    if (!selectedItemId || selectedQuantity <= 0) return;
    const item = selectedType === 'ingredient'
      ? availableIngredients.find(i => i.id === selectedItemId)
      : availableRecipes.find(r => r.id === selectedItemId);
    if (!item) return;

    const unitPrice = selectedType === 'ingredient' ? item.price : item.totalCost;
    const newOrderItem: OrderItem = {
      id: item.id,
      name: item.name,
      type: selectedType,
      quantity: selectedQuantity,
      unitPrice,
      price: unitPrice * selectedQuantity,
    };

    setOrderItems([...orderItems, newOrderItem]);
    setSelectedItemId(null);
    setSelectedQuantity(1);
  };
    
  const calculateSubtotal = () => orderItems.reduce((sum, i) => sum + i.price, 0);
  const calculateTotalWithLaborAndProfit = () => {
    const subtotal = calculateSubtotal();
    return (subtotal + laborCost + subtotal * profitMargin).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      order_name: orderName,
      order_date: orderDate,
      notes,
      labor_cost: laborCost,
      profit_margin: profitMargin,
      items: orderItems.map(i => ({
        item_id: i.id,
        item_type: i.type,
        quantity: i.quantity,
        price: i.price,
      })),
      total_price: parseFloat(calculateTotalWithLaborAndProfit())
    };

    console.log('Submitting order:', orderData);
    setShowPopup(true);
    setTimeout(() => {
      setOrderName('');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setLaborCost(0);
      setProfitMargin(0.4);
      setOrderItems([]);
      setShowPopup(false);
    }, 15000);
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create a New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order-name" className="block text-sm font-medium text-gray-900 dark:text-white">Order Name</label>
              <input id="order-name" type="text" value={orderName} onChange={(e) => setOrderName(e.target.value)} className="input" required />
            </div>
            <div>
              <label htmlFor="order-date" className="block text-sm font-medium text-gray-900 dark:text-white">Order Date</label>
              <input id="order-date" type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="input" required />
            </div>
            <div>
              <label htmlFor="labor-cost" className="block text-sm font-medium text-gray-900 dark:text-white">Labor Cost</label>
              <input id="labor-cost" type="number" value={laborCost} onChange={(e) => setLaborCost(parseFloat(e.target.value))} className="input" step="0.01" />
            </div>
            <div>
              <label htmlFor="profit-margin" className="block text-sm font-medium text-gray-900 dark:text-white">Profit Margin (%)</label>
              <input id="profit-margin" type="number" value={profitMargin * 100} onChange={(e) => setProfitMargin(parseFloat(e.target.value) / 100)} className="input" step="1" />
            </div>
          </div>
          <div className="space-y-4">
  <div className="flex space-x-2">
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium border ${selectedType === 'ingredient' ? 'bg-blue-700 text-white border-blue-700' : 'bg-gray-200 text-gray-800'} rounded-l-lg`}
      onClick={() => { setSelectedType('ingredient'); setSelectedItemId(null); }}
    >
      Ingredients
    </button>
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium border ${selectedType === 'recipe' ? 'bg-blue-700 text-white border-blue-700' : 'bg-gray-200 text-gray-800'} rounded-r-lg`}
      onClick={() => { setSelectedType('recipe'); setSelectedItemId(null); }}
    >
      Recipes
    </button>
  </div>

  <div className="grid gap-4 sm:grid-cols-3">
    <div className="sm:col-span-2">
      <label htmlFor="item-select" className="block text-sm font-medium text-gray-900 dark:text-white">
        {selectedType === 'ingredient' ? 'Select Ingredient' : 'Select Recipe'}
      </label>
      <select
        id="item-select"
        className="input"
        value={selectedItemId || ''}
        onChange={(e) => setSelectedItemId(Number(e.target.value))}
      >
        <option value="">Select</option>
        {(selectedType === 'ingredient' ? availableIngredients : availableRecipes).map(item => (
          <option key={item.id} value={item.id}>
            {item.name} - ${selectedType === 'ingredient' ? item.price.toFixed(2) : item.totalCost.toFixed(2)}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="quantity" className="block text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
      <input
        type="number"
        id="quantity"
        className="input"
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
        min={1}
      />
    </div>
  </div>

  <button
    type="button"
    className="btn-primary"
    onClick={addItemToOrder}
  >
    Add to Order
  </button>

  {orderItems.length > 0 && (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Item</th>
            <th scope="col" className="py-3 px-6">Type</th>
            <th scope="col" className="py-3 px-6">Quantity</th>
            <th scope="col" className="py-3 px-6">Unit Price</th>
            <th scope="col" className="py-3 px-6">Total</th>
            <th scope="col" className="py-3 px-6">Action</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-4 px-6">{item.name}</td>
              <td className="py-4 px-6 capitalize">{item.type}</td>
              <td className="py-4 px-6">{item.quantity}</td>
              <td className="py-4 px-6">${item.unitPrice.toFixed(2)}</td>
              <td className="py-4 px-6">${item.price.toFixed(2)}</td>
              <td className="py-4 px-6">
                <button
                  type="button"
                  onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-900 dark:text-white">Notes</label>
            <textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} className="input w-full" placeholder="Optional notes..." />
          </div>
          <div className="flex justify-between">
            <p className="text-lg font-semibold">Total: ${calculateTotalWithLaborAndProfit()}</p>
            <button type="submit" className="btn-primary">Create Order</button>
          </div>
        </form>
        {showPopup && (
          <div className="mt-8 bg-green-100 p-4 rounded shadow text-green-800">
            <h3 className="font-bold">Order Submitted</h3>
            <p>Order Name: {orderName}</p>
            <p>Order Date: {orderDate}</p>
            <p>Total: ${calculateTotalWithLaborAndProfit()}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderForm;