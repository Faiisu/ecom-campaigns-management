import React, { useState, useEffect } from 'react';
import { FaBullhorn, FaCheck, FaPlus, FaTrash, FaPlay } from 'react-icons/fa';
import CampaignCategoriesModal from '../components/CampaignCategoriesModal';

interface CampaignCategory {
    id: string;
    name: string;
    description: string;
}

interface ProductCategory {
    id: string;
    name: string;
}

interface Campaign {
    id: string;
    name: string;
    description: string;
    discount_type: string;
    discount_value: number;
    start_at: string;
    end_at: string;
    is_active: boolean;
    campaign_category_id: string;
    product_categories?: { id: string; name: string }[];
}

const CampaignPage: React.FC = () => {
    // Campaign State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [categoryId, setCategoryId] = useState('');
    const [selectedProductCategoryIds, setSelectedProductCategoryIds] = useState<string[]>([]);

    // Shared State
    const [categories, setCategories] = useState<CampaignCategory[]>([]);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

    useEffect(() => {
        fetchCategories();
        fetchProductCategories();
        fetchCampaigns();
    }, []);

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

    const fetchProductCategories = async () => {
        try {
            const response = await fetch(`${backendUrl}/product-categories`);
            if (response.ok) {
                const data = await response.json();
                setProductCategories(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching product categories:', error);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const response = await fetch(`${backendUrl}/campaigns`);
            if (response.ok) {
                const data = await response.json();
                setCampaigns(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${backendUrl}/campaigns`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    description,
                    discount_type: discountType,
                    discount_value: parseFloat(discountValue),
                    start_at: new Date(startAt).toISOString(),
                    end_at: new Date(endAt).toISOString(),
                    is_active: isActive,
                    campaign_category_id: categoryId,
                    list_product_category_id: selectedProductCategoryIds,
                }),
            });

            if (response.ok) {
                await fetchCampaigns();
                setMessage({ type: 'success', text: 'Campaign created successfully!' });
                // Reset form
                setName('');
                setDescription('');
                setDiscountValue('');
                setStartAt('');
                setEndAt('');
                setCategoryId('');
                setSelectedProductCategoryIds([]);
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.message || 'Failed to create campaign' });
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            setMessage({ type: 'error', text: 'Error creating campaign' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivateCampaign = async (id: string) => {
        try {
            const response = await fetch(`${backendUrl}/campaigns/${id}/activate`, {
                method: 'PATCH',
            });

            if (response.ok) {
                await fetchCampaigns();
                setMessage({ type: 'success', text: 'Campaign reactivated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to reactivate campaign' });
            }
        } catch (error) {
            console.error('Error activating campaign:', error);
            setMessage({ type: 'error', text: 'Error activating campaign' });
        }
    };

    const handleDeleteCampaign = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) return;

        try {
            const response = await fetch(`${backendUrl}/campaigns/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchCampaigns();
                setMessage({ type: 'success', text: 'Campaign deleted successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to delete campaign' });
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            setMessage({ type: 'error', text: 'Error deleting campaign' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">Campaign Management</h1>
                    <p className="mt-4 text-lg text-gray-500">Create and manage your marketing campaigns</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.type === 'success' ? <FaCheck /> : null}
                        {message.text}
                    </div>
                )}

                {/* Campaigns Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaBullhorn className="text-indigo-600" /> Campaigns
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Campaigns List */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Products</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {campaigns.length > 0 ? (
                                            campaigns.map((camp) => {
                                                const category = categories.find(c => c.id === camp.campaign_category_id);
                                                return (
                                                    <tr key={camp.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">{camp.name}</div>
                                                            <div className="text-sm text-gray-500">{new Date(camp.start_at).toLocaleDateString()} - {new Date(camp.end_at).toLocaleDateString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {category ? category.name : <span className="text-gray-400 italic">Unknown</span>}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {camp.product_categories && camp.product_categories.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1">
                                                                    {camp.product_categories.map(pc => (
                                                                        <span key={pc.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                            {pc.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 italic">All Products</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            {camp.discount_type === 'percentage' ? `${camp.discount_value}%` : `$${camp.discount_value}`}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${camp.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {camp.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                                            {!camp.is_active && (
                                                                <button
                                                                    onClick={() => handleActivateCampaign(camp.id)}
                                                                    className="text-green-600 hover:text-green-900 transition-colors"
                                                                    title="Reactivate Campaign"
                                                                >
                                                                    <FaPlay />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteCampaign(camp.id)}
                                                                className="text-red-600 hover:text-red-900 transition-colors"
                                                                title="Delete Campaign"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No campaigns found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Create Campaign Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="bg-indigo-600 px-6 py-4">
                                    <h3 className="text-lg font-bold text-white">Add New Campaign</h3>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleCreateCampaign} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                placeholder="e.g., Black Friday"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none h-20 resize-none"
                                                placeholder="Details..."
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                <select
                                                    value={discountType}
                                                    onChange={(e) => setDiscountType(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                                >
                                                    <option value="percentage">%</option>
                                                    <option value="fixed">$</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={discountValue}
                                                    onChange={(e) => setDiscountValue(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                                                <input
                                                    type="datetime-local"
                                                    value={startAt}
                                                    onChange={(e) => setStartAt(e.target.value)}
                                                    className="w-full px-2 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                                                <input
                                                    type="datetime-local"
                                                    value={endAt}
                                                    onChange={(e) => setEndAt(e.target.value)}
                                                    className="w-full px-2 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 outline-none text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <div className="flex gap-2">
                                                <select
                                                    value={categoryId}
                                                    onChange={(e) => setCategoryId(e.target.value)}
                                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.length > 0 ? (
                                                        categories.map((cat) => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))
                                                    ) : (
                                                        <option value="" disabled>No categories</option>
                                                    )}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCategoryModalOpen(true)}
                                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                    title="Manage Categories"
                                                >
                                                    <FaPlus className="text-xl" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Product Categories</label>
                                            <div className="bg-white border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                                                {productCategories.length > 0 ? (
                                                    productCategories.map((cat) => (
                                                        <div key={cat.id} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`prod-cat-${cat.id}`}
                                                                value={cat.id}
                                                                checked={selectedProductCategoryIds.includes(cat.id)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setSelectedProductCategoryIds([...selectedProductCategoryIds, cat.id]);
                                                                    } else {
                                                                        setSelectedProductCategoryIds(selectedProductCategoryIds.filter(id => id !== cat.id));
                                                                    }
                                                                }}
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                            />
                                                            <label htmlFor={`prod-cat-${cat.id}`} className="ml-2 block text-sm text-gray-900">
                                                                {cat.name}
                                                            </label>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-500">No product categories found.</p>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Select categories to apply this campaign to. Leave empty to apply to <strong>ALL</strong> products.</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                                Active
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-70"
                                        >
                                            {isLoading ? 'Creating...' : 'Create Campaign'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CampaignCategoriesModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onUpdate={fetchCategories}
            />
        </div>
    );
};

export default CampaignPage;
