// import Link from 'next/link';
// import { getDatabase } from '@/lib/notion';
// import Text from '../components/text';
// import styles from '@/app/index.module.css';
// import { Navigation } from "../components/nav";
// import { Key } from 'react';

// async function getPosts() {
//   const database = await getDatabase();
//   return database;
// }

// export default async function Page() {
//   const posts = await getPosts();
//   console.log(posts[0])
//   return (
//     <div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
//       <Navigation />
//       <div className="container flex items-center justify-center py-12"></div>
//       <main className="p-0 max-w-[700px] m-auto">
//         <h2 className="text-gray-50 py-4 font-bold text-4xl">All Posts</h2>
//         <div className="w-full h-px bg-zinc-800" />
//         <ol>
//           {posts.map((post) => {
//             let date = null;
//             if (post.properties?.last_edited_time) {
//               date = new Date(post.properties.last_edited_time.toString()).toLocaleString('en-US', {
//                 month: 'short',
//                 day: '2-digit',
//                 year: 'numeric',
//               });
//             }
//             const link = post.properties.url.url;
//             const title = post.properties.Title.title;
//             const category = post.properties?.category?.multi_select[0]?.name
//             return (
//               <li key={post.id} >
//                 <h3 className='text-gray-100 text-2xl'>
//                   <Link href={link}>
//                     <Text title={title} />
//                   </Link>
//                 </h3>
//                 <div className='inline-block bg-gray-300/20 p-1 rounded'>
//                   <p className="text-gray-400 text-xs">{category}</p>
//                 </div>
//                 <p className="text-white/60 py-1 text-sm">{date}</p>
//                 <Link className="text-blue-500/60 py-2" href={link}>Read post →</Link>
//                 <div className="w-full h-px bg-zinc-800" />
//               </li>
//             );
//           })}
//         </ol>
//       </main>
//     </div>
//   )}

// Temporary placeholder until Notion integration is set up
export default function Page() {
  return (
    <div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
      <div className="container flex items-center justify-center min-h-screen">
        <h1 className="text-gray-50 text-2xl">Research page coming soon</h1>
      </div>
    </div>
  )
}

