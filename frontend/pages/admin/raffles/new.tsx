import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminRafflesNewPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main raffles page where new raffle form is
    router.push('/admin/raffles?new=true');
  }, [router]);

  return null;
};

export default AdminRafflesNewPage;
