import { useRouter } from 'next/router';
import useSWR from 'swr';
import Loading from '@/loading';
import OrderDetail from '@/components/ProductDetailModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OrderDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Use SWR to fetch the product details based on the id
    const { data: order, error } = useSWR(id ? `/api/order/${id}` : null, fetcher);

    if (error) return <div>Failed to load order</div>;
    if (!order) return <Loading />;

    // return <OrderDetail order={order} onBack={() => router.back()} />;
};

export default OrderDetailPage;
