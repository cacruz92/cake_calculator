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
    
    let newOrderItem: OrderItem | null = null;
    
    if (selectedType === 'ingredient') {
      const ingredient = availableIngredients.find(ing => ing.id === selectedItemId);
      if (!ingredient) return;
      
      newOrderItem = {
        id: ingredient.id,
        name: ingredient.name,
        type: 'ingredient',
        quantity: selectedQuantity,
        unitPrice: ingredient.price,
        price: ingredient.price * selectedQuantity
      };
    } else {
      const recipe = availableRecipes.find(rec => rec.id === selectedItemId);
      if (!recipe) return;
      
      newOrderItem = {
        id: recipe.id,
        name: recipe.name,
        type: 'recipe',
        quantity: selectedQuantity,
        unitPrice: recipe.totalCost,
        price: recipe.totalCost * selectedQuantity
      };
    }
    
    if (newOrderItem) {
      setOrderItems([...orderItems, newOrderItem]);
      
      // Reset selection
      setSelectedItemId(null);
      setSelectedQuantity(1);
    }
  };

  // Remove item from order
  const removeOrderItem = (index: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems.splice(index, 1);
    setOrderItems(newOrderItems);
  };

  // Calculate order total
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order object
    const orderData = {
      order_name: orderName,
      order_date: orderDate,
      notes,
      items: orderItems.map(item => ({
        item_id: item.id,
        item_type: item.type,
        quantity: item.quantity,
        price: item.price
      })),
      total_price: parseFloat(calculateTotal())
    };
    
    // once I connect database remove this line
    console.log('Submitting order:', orderData);

    //Show the Popup
    setShowPopup(true);
    
    // Reset form
    setTimeout(() => {
      setOrderName('');
      setOrderDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setOrderItems([]);
      setShowPopup(false);
    }, 15000);

    //After the above timeout, I want it to go to the order page. 
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Create a New Order</h2>
        <form onSubmit={handleSubmit}>
          
          <div className="grid gap-4 mb-6 sm:grid-cols-2">
            <div>
              <label htmlFor="order-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Order Name</label>
              <input 
                type="text" 
                id="order-name" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="Enter order name" 
                required 
              />
            </div>
            <div>
              <label htmlFor="order-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Order Date</label>
              <input 
                type="date" 
                id="order-date" 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                required 
              />
            </div>
          </div>

          
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Add Items to Order</h3>
            
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Type</label>
              <div className="flex">
                <button 
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border ${selectedType === 'ingredient' 
                    ? 'bg-blue-700 text-white border-blue-700' 
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 border-gray-300'} rounded-l-lg`}
                  onClick={() => {
                    setSelectedType('ingredient');
                    setSelectedItemId(null);
                  }}
                >
                  Ingredients
                </button>
                <button 
                  type="button"
                  className={`px-4 py-2 text-sm font-medium border ${selectedType === 'recipe' 
                    ? 'bg-blue-700 text-white border-blue-700' 
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200 border-gray-300'} rounded-r-lg`}
                  onClick={() => {
                    setSelectedType('recipe');
                    setSelectedItemId(null);
                  }}
                >
                  Recipes
                </button>
              </div>
            </div>
            
            
            <div className="grid gap-4 mb-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label htmlFor="item-select" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  {selectedType === 'ingredient' ? 'Select Ingredient' : 'Select Recipe'}
                </label>
                <select 
                  id="item-select" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={selectedItemId || ''}
                  onChange={(e) => setSelectedItemId(Number(e.target.value))}
                >
                  <option value="">Select {selectedType === 'ingredient' ? 'an ingredient' : 'a recipe'}</option>
                  {selectedType === 'ingredient' 
                    ? availableIngredients.map(ing => (
                        <option key={ing.id} value={ing.id}>
                          {ing.name} - ${ing.price.toFixed(2)} per {ing.measurement_value}{ing.measurement_type}
                        </option>
                      ))
                    : availableRecipes.map(recipe => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.name} - ${recipe.totalCost.toFixed(2)}
                        </option>
                      ))
                  }
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
                <input 
                  type="number" 
                  id="quantity" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  min="1"
                  step="1"
                />
              </div>
            </div>
            
            <button 
              type="button" 
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={addItemToOrder}
            >
              Add to Order
            </button>
            
            
            {orderItems.length > 0 && (
              <div className="mb-6">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Order Items:</h4>
                <div className="overflow-x-auto relative">
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
                          <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.name}
                          </td>
                          <td className="py-4 px-6 capitalize">
                            {item.type}
                          </td>
                          <td className="py-4 px-6">
                            {item.quantity}
                          </td>
                          <td className="py-4 px-6">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            <button 
                              type="button"
                              onClick={() => removeOrderItem(index)}
                              className="font-medium text-red-600 dark:text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold text-gray-900 dark:text-white">
                        <td className="py-3 px-6 text-base">Total</td>
                        <td colSpan={4}></td>
                        <td className="py-3 px-6">${calculateTotal()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          
          <div className="mb-6">
            <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Order Notes</label>
            <textarea 
              id="notes" 
              rows={4} 
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
              placeholder="Add any additional information about the order"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          
          
          <button 
            type="submit" 
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Create Order
          </button>
        </form>
      </div>

      {showPopup && (
        <div className='fixed inset-0 bg-gray-50 flex items-center justify-center z-50'>
        <div className='bg-white p-6 rounded-lg shadow-lg text center'>
          <h2 className='font-bold text-black-900'>Order Submitted</h2>
          
          <div>
            <h3>Items:</h3>
            <p><span className='font-medium'>Order Name:</span>{orderName}</p>
            <p><span className='font-medium'>Order Date:</span>{orderDate}</p>
            <p><span className='font-medium'>Total Amount</span>${calculateTotal()}</p>
            
            <ul>
              {orderItems.map((item,idx) => (
                <li key={idx}>
                  {item.quantity} x {item.name} (${item.unitPrice.toFixed(2)} each) - ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>

        </div>
        </div>
      )}

    </section>
  );
};

export default OrderForm;