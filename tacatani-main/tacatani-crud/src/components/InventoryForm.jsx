// src/components/InventoryForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function InventoryForm({ itemData, fetchItems, setIsEdit }) {
    const [form, setForm] = useState({
        name: '',
        quantity: '',
        price: '',
        description: '',
    });

    useEffect(() => {
        if (itemData) {
            setForm(itemData); // Populate form with existing item data for editing
        }
    }, [itemData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (itemData) {
                // If editing, send PUT request
                await axios.put(`${API}/items/${itemData.id}`, form);
            } else {
                // If creating new, send POST request
                await axios.post(`${API}/items`, form);
            }
            fetchItems(); // Fetch updated list after submit
            setIsEdit(false); // Close edit mode
            setForm({ name: '', quantity: '', price: '', description: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-6">
            <h2 className="text-xl font-bold text-blue-700">{itemData ? 'Edit Item' : 'Add Item'}</h2>

            <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Item Name"
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-2 border border-gray-300 rounded"
                required
            />
            <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full p-2 border border-gray-300 rounded"
            />

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {itemData ? 'Update Item' : 'Add Item'}
            </button>
        </form>
    );
}
