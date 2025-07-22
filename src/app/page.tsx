import dynamic from 'next/dynamic';

const CVBuilder = dynamic(() => import("../components/CVBuilder/CVBuilder").then(mod => ({ default: mod.CVBuilder })), {
  ssr: false
});

export default function Home() {
  return <CVBuilder />;
}
