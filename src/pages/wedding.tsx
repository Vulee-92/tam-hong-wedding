import { Helmet } from 'react-helmet-async';
import WeddingView from 'src/sections/wedding/view';

export default function WeddingPage() {
  return (
    <>
      <Helmet>
        <title>Lễ Thành Hôn | Tâm & Hồng</title>
      </Helmet>

      <WeddingView />
    </>
  );
} 