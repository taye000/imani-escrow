import { useRouter } from 'next/router';
import useSWR from 'swr';
import ProductDetail from '@/components/ProductDetail';
import Loading from '@/loading';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProductDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Use SWR to fetch the product details based on the id
    const { data: product, error } = useSWR(id ? `/api/product/${id}` : null, fetcher);

    if (error) return <div>Failed to load product</div>;
    if (!product) return <Loading />;

    return <ProductDetail product={product} onBack={() => router.back()} />;
};

export default ProductDetailPage;
