import { useEffect, useState } from 'react';
import axios from 'axios';
import InventoryForm from './InventoryForm';

const API = 'http://localhost:8000';

export default function InventoryList() {
    const [items, setItems] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [itemData, setItemData] = useState(null);

    // Fetch all inventory items
    const fetchItems = async () => {
        try {
            const response = await axios.get(`${API}/items`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`${API}/items/${id}`);
                fetchItems(); // Refresh the list after deletion
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleEdit = (item) => {
        setItemData(item); // Set the item data for editing
        setIsEdit(true);    // Switch to edit mode (display the form)
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded shadow">
            <InventoryForm itemData={itemData} fetchItems={fetchItems} setIsEdit={setIsEdit} />
            <h2 className="text-xl font-bold my-4 text-blue-700">Inventory List</h2>

            {items.length === 0 ? (
                <p className="text-gray-500">No items in the inventory.</p>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-200">
                    <thead className="bg-gray-100 text-center">
                        <tr>
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Quantity</th>
                            <th className="border px-4 py-2">Price</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">{item.price}</td>
                                <td className="border px-4 py-2">{item.description}</td>
                                <td className="border px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleEdit(item)} // Trigger edit
                                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)} // Trigger delete
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
