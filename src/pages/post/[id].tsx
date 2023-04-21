import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { Layout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/PostView";


// Home
const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {

  const { data/*, isLoading */ } = api.posts.getById.useQuery({ id })

  // never hit this because of static fallback: 'blocking'
  // if (isLoading) {
  //   console.log('loading')
  //   return <div>loading</div>;
  // };

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <Layout>
        <PostView {...data} />
      </Layout>
    </>
  );
};

// generate static page
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("id is not valid");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id
    },
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default SinglePostPage;

