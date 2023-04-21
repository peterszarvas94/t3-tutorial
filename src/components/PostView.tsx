import Image from "next/image";
import type { RouterOutputs } from "~/utils/api";
import { Noto_Color_Emoji } from 'next/font/google'
import dayjs from "dayjs";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";

// dayjs
dayjs.extend(relativeTime);

// fonts
const notoemoji = Noto_Color_Emoji({
  subsets: ['emoji'],
  weight: ['400'],
});

// PostView
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
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

