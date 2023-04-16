import { SignInButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { Inter, Noto_Color_Emoji } from 'next/font/google'
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

// fonts
const notoemoji = Noto_Color_Emoji({
  subsets: ['emoji'],
  weight: ['400'],
});
const inter = Inter({ subsets: ['latin'] });

// dayjs
dayjs.extend(relativeTime);

// CreatePostWizzard
const CreatePostWizzard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong");
      }
    }
  });

  if (!user) return null;

  return (
    <form
      className="flex w-full gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ content: input });
      }}
    >
      <Image
        src={user.profileImageUrl}
        alt="Pofile image"
        className="w-14 h-14 rounded-full" width="56" height="56"
      />

      <input
        placeholder="Type some emojis"
        className="bg-transparent grow outline-none"
        type="text"
        name="content"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button type="submit">Post</button>)
      }

      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </form>
  )
};


// PostView
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="p-4 border-b border-slate-400 flex gap-3">
      <Image
        src={author.profileImageUrl}
        alt="Pofile image"
        className="rounded-full w-14 h-14"
        width="56"
        height="56"
      />
      <div className="flex flex-col gap-0 text-slate-300 font-thin w-full">
        <div className="flex gap-1">
          <Link href={`/@${author.username}`}>
            <div className="font-normal">{`@${author.username}`}</div>
          </Link>
          <div>·</div>
          <Link href={`/post/${post.id}`} className="grow">
            <div>{dayjs(post.createdAt).fromNow()}</div>
          </Link>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className={`${notoemoji.className} text-2xl`}>{post.content}</span>
        </Link>
      </div>
    </div>
  );
};

// Feed
const Feed = () => {
  // It can use the cached data, if already fetched
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
}

// Home
const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap, cache it
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <main className={`${inter.className} flex justify-center min-h-screen`}>
      <div className="w-full md:max-w-2xl border-x border-slate-400 min-h-screen h-full">
        <div className="flex border-b border-slate-400 p-4 ">
          {!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}
          {isSignedIn && <CreatePostWizzard />}
        </div>
        <Feed />
      </div>
    </main>
  );
};

export default Home;
