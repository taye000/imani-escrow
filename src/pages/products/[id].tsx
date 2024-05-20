import { useRouter } from 'next/router';
import ProductDetail from '@/components/ProductDetail';
import { productData } from '../marketplace';


const ProductDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Find the product based on the id from the URL
    const product = productData.find((item) => item.id === id);

    if (!product) {
        return <div>Product not found</div>; // Handle product not found
    }

    return <ProductDetail product={product} onBack={() => router.back()} />;
};
export default ProductDetailPage;
