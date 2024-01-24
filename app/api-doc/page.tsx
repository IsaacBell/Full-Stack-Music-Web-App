import { getApiDocs } from '@/libs/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container bg-white h-max pb-40">
      <ReactSwagger spec={spec} />
    </section>
  );
}
