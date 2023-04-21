import { SignInButton, useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Layout } from "~/components/layout";
import { PostView } from "~/components/PostView";

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
    <Layout>

      <div className="flex border-b border-slate-400 p-4 ">
        {!isSignedIn && (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        )}
        {isSignedIn && <CreatePostWizzard />}
      </div>
      <Feed />
    </Layout>
  );
};

export default Home;
