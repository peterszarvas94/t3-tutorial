import type { NextPage } from "next";
import Head from "next/head";
import { Inter, /* Noto_Color_Emoji */ } from 'next/font/google'

// fonts
// const notoemoji = Noto_Color_Emoji({
//   subsets: ['emoji'],
//   weight: ['400'],
// });
const inter = Inter({ subsets: ['latin'] });
// Home
const ProfilePage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <main className={`${inter.className} flex justify-center min-h-screen`}>
        post view
      </main>
    </>
  );
};

export default ProfilePage;
