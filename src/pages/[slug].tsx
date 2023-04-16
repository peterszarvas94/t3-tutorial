import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { Inter, /* Noto_Color_Emoji */ } from 'next/font/google'
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import SuperJSON from "superjson";

// fonts
// const notoemoji = Noto_Color_Emoji({
//   subsets: ['emoji'],
//   weight: ['400'],
// });
const inter = Inter({ subsets: ['latin'] });

// Home
const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data/*, isLoading */ } = api.profile.getUserByUserName.useQuery({
    username
  });

  // never hit this because of static fallback: 'blocking'
  // if (isLoading) {
  //   console.log('loading')
  //   return <div>loading</div>;
  // };

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`@${data.username}`}</title>
      </Head>
      <main className={`${inter.className} flex justify-center min-h-screen`}>
        profile
      </main>
    </>
  );
};

// generate static page
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("slug is not valid");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUserName.prefetch({ username });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    }
  }
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default ProfilePage;
