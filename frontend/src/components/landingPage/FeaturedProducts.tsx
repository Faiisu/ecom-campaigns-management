import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    product_category_name: string;
}

const FeaturedProducts: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [quantities, setQuantities] = React.useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
                const response = await fetch(`${backendUrl}/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Products</h2>
                        <div className="mt-8 flex justify-center">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    const getQuantity = (productId: string) => quantities[productId] || 1;

    const updateQuantity = (productId: string, value: number) => {
        const newQuantity = Math.max(1, value);
        setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    };

    const addToCart = async (productId: string) => {
        const guestId = localStorage.getItem('guestId');
        if (!guestId) {
            navigate('/login');
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            const response = await fetch(`${backendUrl}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: getQuantity(productId),
                    user_id: guestId,
                }),
            });

            if (response.ok) {
                alert('Product added to cart!');
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding to cart');
        }
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Products</h2>
                    <p className="mt-4 text-lg text-gray-600">Hand-picked items just for you</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-90 transition-opacity h-64">
                                <img
                                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-indigo-600 font-medium mb-1">{product.product_category_name || 'Uncategorized'}</p>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xl font-bold text-gray-900">฿{product.price.toFixed(2)}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                                            <button
                                                onClick={() => updateQuantity(product.id, getQuantity(product.id) - 1)}
                                                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                            >
                                                <FaMinus size={10} />
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={getQuantity(product.id)}
                                                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                                                className="w-10 text-center border-none bg-transparent focus:ring-0 text-sm font-medium text-gray-900 p-0"
                                            />
                                            <button
                                                onClick={() => updateQuantity(product.id, getQuantity(product.id) + 1)}
                                                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                            >
                                                <FaPlus size={10} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product.id)}
                                            className="p-2.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm flex-shrink-0"
                                            title="Add to Cart"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
