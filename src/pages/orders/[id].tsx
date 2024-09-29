import { useRouter } from 'next/router';
import useSWR from 'swr';
import Loading from '@/loading';
import OrderDetail from '@/components/OrderDetail';
import { useOrderContext } from '@/context/OrderContext';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const OrderDetailPage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Use SWR to fetch the product details based on the id
    const { data: order, error } = useSWR(id ? `/api/orders/${id}` : null, fetcher);

    const { updateOrder } = useOrderContext();

    const handleUpdateOrder = async (status: string, comment?: string) => {
        if (id) {
            try {
                await updateOrder(id as string, { status, comment });
                // You can show additional success message if needed
            } catch (error) {
                console.error("Failed to update order:", error);
                toast.error("Failed to update order");
            }
        }
    };

    if (error) return <div>Failed to load order</div>;
    if (!order) return <Loading />;

    return <OrderDetail order={order} onBack={() => router.back()} onUpdateOrder={handleUpdateOrder} />;
};

export default OrderDetailPage;
