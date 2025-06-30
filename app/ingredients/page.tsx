"use client"

import React, { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  item_name: string;
  quantity: number;
  measurement_type: string;
  price: number;
  store: string;
  date_added: string;
  description: string;
}

const Ingredients: React.FC = () => {

  const[formData, setFormData] = useState({
    name: '',
    measurement_value: '',
    measurement_type: '',
    price: '',
    store: '',
    description: ''
  });

  const [status, setStatus] = useState({
    isSubmitting: false,
    message: '',
    isError: false
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('api/ingredients');
      if(!response.ok) {
        throw new Error('Failed to load ingredients');
      }
      const data = await response.json();
      setIngredients(data);
    } catch (error){
      console.error('Error loading ingredients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ isSubmitting: true, message: '', isError: false })

    if (formData.measurement_type === 'Select measurement'){
      setStatus({
        isSubmitting: false,
        message: 'Please select a measurement type',
        isError: true
      });
      return;
    }
    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          store: formData.store,
          measurement_value: parseFloat(formData.measurement_value),
          measurement_type: formData.measurement_type,
          description: formData.description
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({
          name: '',
          price: '',
          store: '',
          measurement_value: '',
          measurement_type: 'Select measurement',
          description: ''
        });
        setStatus({
          isSubmitting: false,
          message: result.message || 'Ingredient added successfully!',
          isError: false
        });

        //Refresh Ingredient List
        fetchIngredients();
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error: any) {
      console.error('Error adding ingredient:', error);
      setStatus({
        isSubmitting: false,
        message: error.message || 'Failed to add ingredient',
        isError: true
      });
    }

  }

  const formatMeasurement = (quantity: number, type: string) => {
    const measurementMap: Record<string, string> = {
      'tsp': 'teaspoon(s)',
      'tbsp': 'tablespoon(s)',
      'cup': 'cup(s)',
      'floz': 'fluid ounce(s)',
      'oz': 'ounce(s)',
      'g': 'gram(s)',
      'kg': 'kilogram(s)',
      'ml': 'milliliter(s)',
      'l': 'liter(s)',
      'pint': 'pint(s)',
      'quart': 'quart(s)',
      'gallon': 'gallon(s)',
      'unit': 'unit(s)',
      'lb': 'pound(s)'
    };
    
    const readableType = measurementMap[type] || type;
    return `${quantity} ${readableType}`;
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) {
      return '$0.00';
    }
    
    return `$${numericPrice.toFixed(2)}`;
  };


  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new ingredient</h2>

        {status.message && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${
            status.isError 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ingredient Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Type product name" required />
            </div>

            <div className="w-full">
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="$2999" required />
            </div>

            <div className="w-full">
              <label htmlFor="store" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Store</label>
              <input type="text" name="store" id="store" value={formData.store} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Store purchase at" required />
            </div>
            

            <div>
              <label htmlFor="measurement_value" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Measurement</label>
              <input type="number" name="measurement_value" id="measurement_value" value={formData.measurement_value} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="12" required />
            </div> 

            <div>
            <label htmlFor="measurement_type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Measurement type</label>
            <select id="measurement_type" name="measurement_type" value={formData.measurement_type} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                <option selected>Select measurement</option>
                <option value="tsp">Teaspoon(s) </option>
                <option value="tbsp">Tablespoon(s) </option>
                <option value="cup">Cup(s)</option>
                <option value="floz">Fluid Ounce(s) </option>
                <option value="oz">Ounce(s) </option>
                <option value="g">Gram(s) </option>
                <option value="kg">Kilogram(s) </option>
                <option value="ml">Milliliter(s) </option>
                <option value="l">Liter(s) </option>
                <option value="pint">Pint(s)</option>
                <option value="quart">Quart(s)</option>
                <option value="gallon">Gallon(s)</option>
                <option value="unit">Unit(s)</option>
                <option value="lb">Pound(s)</option>
            </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange}  rows={8} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Your description here"></textarea>
            </div>
          </div>
          <button type="submit" disabled={status.isSubmitting} className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            {status.isSubmitting ? 'Adding...' : 'Add Ingredient'}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ingredients List</h2>
          
          {isLoading ? (
            <div className="text-center py-4">Loading ingredients...</div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No ingredients added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Name</th>
                    <th scope="col" className="px-4 py-3">Measurement</th>
                    <th scope="col" className="px-4 py-3">Price</th>
                    <th scope="col" className="px-4 py-3">Store</th>
                    <th scope="col" className="px-4 py-3">Date Added</th>
                    <th scope="col" className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {ingredient.item_name}
                      </td>
                      <td className="px-4 py-4">
                        {formatMeasurement(ingredient.quantity, ingredient.measurement_type)}
                      </td>
                      <td className="px-4 py-4">
                        {formatPrice(ingredient.price)}
                      </td>
                      <td className="px-4 py-4">
                        {ingredient.store || '-'}
                      </td>
                      <td className="px-4 py-4">
                        {new Date(ingredient.date_added).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        {ingredient.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Ingredients;