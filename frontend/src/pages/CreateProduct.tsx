import React, { useState, useEffect } from 'react';
import { FaBox, FaTag, FaDollarSign, FaAlignLeft, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

interface Category {
    id: string;
    name: string;
}

interface CreateProductProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
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
            const response = await fetch(`${backendUrl}/product-categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const response = await fetch(`${backendUrl}/product-categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });

            if (response.ok) {
                await fetchCategories();
                setNewCategoryName('');
                setIsCreatingCategory(false);
                setMessage({ type: 'success', text: 'Category created successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to create category' });
            }
        } catch (error) {
            console.error('Error creating category:', error);
            setMessage({ type: 'error', text: 'Error creating category' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${backendUrl}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    price: parseFloat(price),
                    product_category_id: categoryId,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Product created successfully!' });
                // Reset form
                setName('');
                setDescription('');
                setPrice('');
                setCategoryId('');
                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 1500);
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to create product' });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            setMessage({ type: 'error', text: 'Error creating product' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                    <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Create New Product</h1>
                            <p className="text-indigo-100 mt-1 text-sm">Add a new item to your inventory</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-indigo-200 transition-colors">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <div className="p-8">
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {message.type === 'success' ? <FaCheck /> : null}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaBox className="text-gray-400" /> Product Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                    placeholder="e.g., Premium Headphones"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FaAlignLeft className="text-gray-400" /> Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none h-32 resize-none"
                                    placeholder="Describe your product..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Price */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FaDollarSign className="text-gray-400" /> Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <FaTag className="text-gray-400" /> Category
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none bg-white"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No categories found. Create one!</option>
                                            )}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                                            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                            title="Create New Category"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* New Category Input */}
                            {isCreatingCategory && (
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fadeIn">
                                    <label className="text-sm font-medium text-indigo-900 mb-2 block">New Category Name</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="flex-1 px-4 py-2 rounded-lg border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                            placeholder="e.g., Electronics"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateCategory}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating...' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
