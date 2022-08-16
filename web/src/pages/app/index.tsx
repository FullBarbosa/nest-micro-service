import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useGetProductsQuery, useMeQuery } from '../../graphql/generated/graphql';
import { getServerPageGetProducts, ssrGetProducts } from '../../graphql/generated/page';
import { withApollo } from '../../lib/withApollo';

export function Home(props) {
  const {user} = useUser();
  const { data } = useMeQuery();
  return (
    <div>Hello
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>

      <a href="/api/auth/logout">Logout</a>
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {
    return {
      props:{}
    }
  }
});

export default withApollo(
  ssrGetProducts.withPage()(Home)
);