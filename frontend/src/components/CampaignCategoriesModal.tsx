import React, { useState, useEffect } from 'react';
import { FaLayerGroup, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';

interface CampaignCategory {
    id: string;
    name: string;
    description: string;
}

interface CampaignCategoriesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const CampaignCategoriesModal: React.FC<CampaignCategoriesModalProps> = ({ isOpen, onClose, onUpdate }) => {
    const [categories, setCategories] = useState<CampaignCategory[]>([]);
    const [catName, setCatName] = useState('');
    const [catDescription, setCatDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${backendUrl}/campaign-categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${backendUrl}/campaign-categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: catName, description: catDescription }),
            });

            if (response.ok) {
                await fetchCategories();
                onUpdate(); // Refresh parent
                setCatName('');
                setCatDescription('');
                setMessage({ type: 'success', text: 'Category created!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to create category' });
            }
        } catch (error) {
            console.error('Error creating category:', error);
            setMessage({ type: 'error', text: 'Error creating category' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`${backendUrl}/campaign-categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchCategories();
                onUpdate(); // Refresh parent
                setMessage({ type: 'success', text: 'Category deleted!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to delete category' });
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage({ type: 'error', text: 'Error deleting category' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaLayerGroup /> Manage Categories
                        </h2>
                        <button onClick={onClose} className="text-white hover:text-indigo-200 transition-colors">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="p-6">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {message.type === 'success' ? <FaCheck /> : null}
                                {message.text}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* List */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Existing Categories</h3>
                                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
                                    <ul className="divide-y divide-gray-200">
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <li key={cat.id} className="p-4 hover:bg-white transition-colors flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{cat.name}</p>
                                                        <p className="text-sm text-gray-500">{cat.description}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteCategory(cat.id)}
                                                        className="text-red-400 hover:text-red-600 p-1"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="p-4 text-center text-gray-500">No categories found.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* Create Form */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
                                <form onSubmit={handleCreateCategory} className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={catName}
                                            onChange={(e) => setCatName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                            placeholder="e.g., Summer Sale"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={catDescription}
                                            onChange={(e) => setCatDescription(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none h-24 resize-none bg-white"
                                            placeholder="Description..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-70"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Category'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCategoriesModal;
