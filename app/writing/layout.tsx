// This is the 'markdown' renderer for the blog posts, which determines layout, i.e., copying the URL, displaying text
'use client'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { useEffect, useState } from 'react'
import { BLOG_POSTS } from '@/app/data'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import '@/app/styles/prose.css'
import '@/app/styles/markdown.css'
import '@/app/styles/code.css'
import 'katex/dist/katex.css'
import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import PostsPage from '@/app/writing/page'
import CdOut from '@/components/ui/cd-out'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

function BlogHeader() {
  const pathname = usePathname()
  const post = BLOG_POSTS.find((post) => post.link === pathname)

  if (!post) return null

  return (
    <header className="mb-8">
      <meta property="og:title" content={post.title} data-toc-exclude />
      <h1 className="mb-2 text-3xl font-medium" data-toc-exclude>
        {post.title}
      </h1>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-[1.0rem] text-zinc-500 dark:text-zinc-400">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {/* TODO: Add tags back in */}
        {/* <div className="flex flex-row flex-wrap gap-2 mt-2"> */}
          {/* {post.tags.map((tag) => (
            <span 
              key={tag} 
              className="cursor-pointer text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              #{tag}
            </span>
          ))} */}
        {/* </div> */}
      </div>
    </header>
  )
}



export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  const isPostsPage = pathname === '/writing'

  // Add scroll to top effect when pathname changes, but not on refresh
  useEffect(() => {
    // Don't scroll to top if there's a hash in the URL (anchor navigation)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname])

  if (isPostsPage) {
    return <PostsPage />
  }

  return (
    <>
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600"
        springOptions={{
          bounce: 0,
        }}
      />
      <main className="prose prose-gray mt-10 dark:prose-invert prose-pre:bg-transparent prose-pre:p-0">
    <motion.main
      className="space-y-12 mt-10 "
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
          <BlogHeader />
            {children}
        </motion.main>
      </main>
      <motion.section
        variants={VARIANTS_SECTION}
        initial="hidden"
        animate="visible"
        transition={TRANSITION_SECTION}
      >
        <CdOut title="In Writing" link="/writing" />
      </motion.section>
      <motion.section
        variants={VARIANTS_SECTION}
        initial="hidden"
        animate="visible"
        transition={TRANSITION_SECTION}
      >
        <hr className="prose-hr"></hr>
      </motion.section>
      <motion.section
        variants={VARIANTS_SECTION}
        initial="hidden"
        animate="visible"
        transition={TRANSITION_SECTION}
      >
      <div className="">
        <Giscus
          repo="stanley-utf8/stanley"
          repoId="R_kgDOOcaodg"
          category="Writing"
          categoryId="DIC_kwDOOcaods4CpSuT"
          mapping="og:title"
          strict="0"
          reactionsEnabled="0"
          emitMetadata="0"
          inputPosition="top"
          theme={resolvedTheme === 'dark' ? 'transparent_dark' : 'light'}
          lang="en"
          // loading="lazy"
        />
      </div>
      </motion.section>
    </>
  )
}
